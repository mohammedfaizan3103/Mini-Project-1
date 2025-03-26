const express = require("express");
const axios = require("axios");
const connectDB = require("../config/db");
const Mentee = require("../models/Mentee");
const mongoose = require("mongoose");

const router = express.Router();

// const run = async (username) => {
//     await connectDB();
//     // await mongoose.connect("mongodb://localhost:27017/chronoflow");

//     const mentee = await Mentee.findOne({ username: username }).populate("tasks").lean();
//     const tasks = mentee.tasks;

//     const jsonOutput = await generateTaskDataJson(mentee, tasks);
//     return jsonOutput;
//     // console.log(JSON.stringify(jsonOutput, null, 2));

//     // mongoose.connection.close();
// };

// run().catch(console.error);


router.get("/insights", async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        const mentee = await Mentee.findOne({ username }).populate("tasks").lean();
        if (!mentee) {
            return res.status(404).json({ error: "Mentee not found" });
        }

        const taskData = generateTaskDataJson(mentee, mentee.tasks);
        const insights = await generateInsights(taskData, username);

        res.json(insights);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to generate insights" });
    }
});


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const generateInsights = async (taskData, username) => {
    if (!taskData || !taskData.previous_week || !taskData.tasks) {
        console.error("Invalid task data format:", taskData);
        return { error: "Invalid task data format." };
    }

    const prompt = `
Generate a detailed performance review focusing on insights, patterns, and improvement areas based on the following task data:

---

### **Current week:**
- Tasks completed: ${taskData.tasks_completed}
- Tasks delayed: ${taskData.tasks_delayed}
- Average delay: ${taskData.average_delay_days} days  // Updated to days
- Urgent tasks: ${taskData.urgent_tasks}
- Delayed urgent tasks: ${taskData.delayed_urgent_tasks}

---

### **Previous week:**
- Tasks completed: ${taskData.previous_week.tasks_completed}
- Tasks delayed: ${taskData.previous_week.tasks_delayed}

---

### **Previous AI Insights (if available):**
${taskData.previous_insights ? JSON.stringify(taskData.previous_insights, null, 2) : "No previous insights available."}

---

### **Latest Mentor Feedback (if available):**
${taskData.mentor_feedback ? JSON.stringify(taskData.mentor_feedback, null, 2) : "No mentor feedback provided."}

---

### **Task Categories:**
- urgent_important: Critical tasks with significant impact.
- urgent_not_important: Immediate but low-impact tasks.
- not_urgent_important: High-impact but flexible tasks.
- not_urgent_not_important: Low-priority and flexible tasks.

---

### **Task List:**
Analyze the following tasks to detect patterns, trends, and improvement areas.

\`\`\`json
${JSON.stringify(taskData.tasks, null, 2)}
\`\`\`

---

### **Instructions:**

1. **Generate Qualitative Insights:**
   - Briefly compare this week’s performance with previous insights.
   - Identify **new trends** or changes from last week.
   - **Analyze the task names** and detect patterns:
     - Highlight recurring inefficiencies.
   - Include practical and specific **improvement suggestions**.
   - Keep the insights **concise and plain text**, without any formatting symbols.

2. **Pattern Detection:**
   - Identify recurring issues based on the task content.
   - Mention specific patterns or themes (e.g., reports, approvals) that are frequently delayed.
   - Detect if certain categories (urgent, important) consistently face delays.
   - Ensure the output uses **short and clear sentences**.

3. **Improvement Areas:**
   - Suggest **specific and actionable improvements**.
   - If mentor feedback is available, reference it when suggesting areas for improvement.
   - Keep the suggestions brief and plain text.

4. **Missed Tasks Summary:**
   - Generate a **short, readable summary** of missed tasks.
   - Mention common task types or patterns in the summary.
   - Avoid using formatting symbols in the output.

---

### **Response Format:**
{
    "insights": {
        "qualitative_trends": [
            "Short and clear trend 1",
            "Short and clear trend 2"
        ],
        "pattern_detection": [
            "Short recurring issue 1",
            "Short recurring issue 2"
        ],
        "improvement_areas": [
            "Brief improvement 1",
            "Brief improvement 2"
        ],
        "missed_tasks_text": "Concise summary of missed tasks"
    }
}
`;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                "contents": [{ "role": "user", "parts": [{ "text": prompt }] }]
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data && response.data.candidates) {
            let rawText = response.data.candidates[0].content.parts[0].text;

            // ✅ Clean and parse the raw JSON response
            rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            const jsonResponse = JSON.parse(rawText);

            // ✅ Store the insights in the database with the current date
            await storeInsights(username, jsonResponse);

            return jsonResponse;

        } else {
            throw new Error("Invalid API response");
        }

    } catch (error) {
        console.error("Error generating insights:", error);
        return { error: "Failed to generate insights." };
    }
};

const generateTaskDataJson = (mentee, tasks) => {
    const completedTasks = tasks.filter(task => task.completed);
    const delayedTasks = completedTasks.filter(task => task.date_completed > task.date);
    const urgentTasks = completedTasks.filter(task => task.category.includes("Urgent"));
    const delayedUrgentTasks = urgentTasks.filter(task => task.date_completed > task.date);

    // Calculate previous week's date range
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const previousWeekTasks = tasks.filter(task =>
        task.date >= oneWeekAgo && task.date <= today
    );

    const previousWeekCompleted = previousWeekTasks.filter(task => task.completed).length;
    const previousWeekDelayed = previousWeekTasks.filter(task => task.date_completed > task.date).length;

    const averageDelayDays = delayedTasks.length > 0
        ? delayedTasks.reduce((sum, task) => sum + Math.ceil((task.date_completed - task.date) / (1000 * 60 * 60 * 24)), 0) / delayedTasks.length
        : 0;

    // Use a maximum of 5 tasks for insights generation
    const limitedTasks = tasks.slice(0, 5).map(task => {
        const delayDays = Math.ceil((task.date_completed - task.date) / (1000 * 60 * 60 * 24));
        return {
            category: task.category.toLowerCase().replace(/ & /g, "_").replace(/ /g, ""),
            content: task.title,
            initial_due_date: task.date.toISOString().split('T')[0],
            completed_on: task.date_completed ? task.date_completed.toISOString().split('T')[0] : null,
            delay_days: delayDays
        };
    });

    return {
        tasks_completed: completedTasks.length,
        tasks_delayed: delayedTasks.length,
        average_delay_days: averageDelayDays,
        urgent_tasks: urgentTasks.length,
        delayed_urgent_tasks: delayedUrgentTasks.length,
        previous_week: {
            tasks_completed: previousWeekCompleted,
            tasks_delayed: previousWeekDelayed
        },
        tasks: limitedTasks,
        previous_insights: mentee.previous_insights,
        mentor_feedback: mentee.mentor_feedback
    };
};

const storeInsights = async (username, insights) => {
    const mentee = await Mentee.findOne({ username });

    if (!mentee) {
        throw new Error("Mentee not found.");
    }

    // Append new insights with date
    mentee.previous_insights.push({
        text: JSON.stringify(insights, null, 2),
        date: new Date()
    });

    await mentee.save();
};

module.exports = router;  // ✅ Ensure proper export
