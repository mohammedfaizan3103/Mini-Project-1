const express = require("express");
const axios = require("axios");
const connectDB = require("../config/db");
const Mentee = require("../models/Mentee");
const mongoose = require("mongoose");

const router = express.Router();

const run = async (username) => {
    await connectDB();
    // await mongoose.connect("mongodb://localhost:27017/chronoflow");

    const mentee = await Mentee.findOne({ username: username }).populate("tasks").lean();
    const tasks = mentee.tasks;

    const jsonOutput = await generateTaskDataJson(mentee, tasks);
    return jsonOutput;
    // console.log(JSON.stringify(jsonOutput, null, 2));

    // mongoose.connection.close();
};

run().catch(console.error);


router.get("/insights", async (req, res) => {
    const { username } = req.query;  // Get username from query string

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    const data = await run(username);
    console.log(data);
    try {

      const insights = await generateInsights(data);
      res.json(insights);
      
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const generateInsights = async (taskData) => {
    if (!taskData || !taskData.previous_week || !taskData.tasks) {
      console.error("Invalid task data format:", taskData);
      return { error: "Invalid task data format." };
    }
  
    const current = {
      tasks_completed: taskData.tasks_completed || 0,
      tasks_delayed: taskData.tasks_delayed || 0,
      average_delay_hours: taskData.average_delay_hours || 0,
      urgent_tasks: taskData.urgent_tasks || 0,
      delayed_urgent_tasks: taskData.delayed_urgent_tasks || 0
    };
  
    const previous = {
      tasks_completed: taskData.previous_week.tasks_completed || 0,
      tasks_delayed: taskData.previous_week.tasks_delayed || 0
    };
  
    const tasks = taskData.tasks || [];
  
    const tasksString = tasks
      .map(
        (task) => `
        - Category: ${task.category}
        - Content: ${task.content}
        - Initial due date: ${task.initial_due_date}
        - Completed on: ${task.completed_on}`
      )
      .join("\n");
  
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
  ${taskData.mentor_feedback ? taskData.mentor_feedback : "No mentor feedback provided."}
  
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
     - Compare this week’s performance with previous insights.
     - Identify **new trends** or changes from last week.
     - **Analyze the task names** and detect patterns:
       - Are certain types of tasks frequently delayed or completed late?
       - Highlight recurring inefficiencies.
     - Include practical and specific **improvement suggestions**.
  
  2. **Pattern Detection:**
     - Identify recurring issues based on the task content.
     - Mention specific patterns or themes (e.g., reports, approvals) that are frequently delayed.
     - Detect if certain categories (urgent, important) consistently face delays.
  
  3. **Improvement Areas:**
     - Suggest **specific and actionable improvements**.
     - If mentor feedback is available, reference it when suggesting areas for improvement.
  
  4. **Missed Tasks Summary:**
     - Generate a **short, readable summary** of missed tasks.
     - Mention common task types or patterns in the summary.
  
  ---
  
  ### **Response Format:**
  \`\`\`json
  {
    "insights": {
      "qualitative_trends": [
        "<Trend 1>",
        "<Trend 2>"
      ],
      "pattern_detection": [
        "<Recurring issue 1>",
        "<Recurring issue 2>"
      ],
      "improvement_areas": [
        "<Specific improvement 1>",
        "<Specific improvement 2>"
      ],
      "missed_tasks_text": "<Short, readable summary of missed tasks>"
    }
  }
  \`\`\`
  `;
  
  
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          "contents": [
            {
              "role": "user",
              "parts": [{ "text": prompt }]
            }
          ]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
  
      if (response.data && response.data.candidates) {
        let rawText = response.data.candidates[0].content.parts[0].text;
  
        // ✅ Clean the raw response to remove markdown formatting
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
  
        // ✅ Parse the cleaned JSON string
        const jsonResponse = JSON.parse(rawText);
  
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

    const previousWeekTasks = tasks.slice(0, 28);  // Mocking previous week data (first 28 tasks)
    const previousWeekCompleted = previousWeekTasks.filter(task => task.completed).length;
    const previousWeekDelayed = previousWeekTasks.filter(task => task.date_completed > task.date).length;

    const averageDelayDays = delayedTasks.length > 0
        ? delayedTasks.reduce((sum, task) => sum + Math.ceil((task.date_completed - task.date) / (1000 * 60 * 60 * 24)), 0) / delayedTasks.length
        : 0;

    const jsonOutput = {
        tasks_completed: completedTasks.length,
        tasks_delayed: delayedTasks.length,
        average_delay_days: averageDelayDays,
        urgent_tasks: urgentTasks.length,
        delayed_urgent_tasks: delayedUrgentTasks.length,
        previous_week: {
            tasks_completed: previousWeekCompleted,
            tasks_delayed: previousWeekDelayed
        },
        tasks: tasks.map(task => {
            const delayDays = Math.ceil((task.date_completed - task.date) / (1000 * 60 * 60 * 24));
            return {
                category: task.category.toLowerCase().replace(/ & /g, "_").replace(/ /g, ""),
                content: task.title,
                initial_due_date: task.date.toISOString().split('T')[0],
                completed_on: task.date_completed.toISOString().split('T')[0],
                delay_days: delayDays
            };
        }),
        previous_insights: mentee.previous_insights,
        mentor_feedback: mentee.mentor_feedback
    };

    return jsonOutput;
};

module.exports = router;  // ✅ Ensure proper export
