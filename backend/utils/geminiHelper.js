// utils/geminiHelper.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getTaskInsights(tasks) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use the latest available model
        
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

        // Send the prompt to Gemini 2.0
        const result = await model.generateContent([prompt]);

        // Extract text response
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("❌ Error getting AI insights:", error);
        throw error;
    }
}

module.exports = { getTaskInsights };
