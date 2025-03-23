const { GoogleGenerativeAI } = require("@google/generative-ai");
const Insight = require("../models/Insight"); // MongoDB model
require("dotenv").config();

// Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateInsights = async (userId, taskData) => {
    if (!userId || !taskData) {
        return { error: "User ID and task data are required." };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // AI Prompt for generating insights
        const prompt = `
        You are an AI productivity coach. Analyze the user's task performance and provide actionable insights.

        📌 **Current Week Performance**  
        - ✅ Tasks Completed: ${taskData.tasks_completed}  
        - ⚠️ Tasks Delayed: ${taskData.tasks_delayed}  
        - ⏳ Average Delay: ${taskData.average_delay_hours} hours  
        - 🔥 Urgent Tasks: ${taskData.urgent_tasks}  
        - ❗ Delayed Urgent Tasks: ${taskData.delayed_urgent_tasks}  

        📊 **Previous Week Performance**  
        - ✅ Tasks Completed: ${taskData.previous_week.tasks_completed}  
        - ⚠️ Tasks Delayed: ${taskData.previous_week.tasks_delayed}  

        📈 **Your Task:**  
        - Compare this week's performance with last week.  
        - Identify patterns and suggest improvements.  
        - Provide 3 actionable tips to reduce delays.  
        - Suggest a strategy for urgent task prioritization.  
        - Keep the response **brief, structured, and user-friendly**.  
        `;

        // Generate AI response
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const generatedInsight = response.text();

        // Save the insight to MongoDB
        const newInsight = new Insight({
            userId,
            tasksCompleted: taskData.tasks_completed,
            tasksDelayed: taskData.tasks_delayed,
            averageDelayHours: taskData.average_delay_hours,
            urgentTasks: taskData.urgent_tasks,
            delayedUrgentTasks: taskData.delayed_urgent_tasks,
            previousWeek: {
                tasksCompleted: taskData.previous_week.tasks_completed,
                tasksDelayed: taskData.previous_week.tasks_delayed
            },
            generatedInsight,
        });

        await newInsight.save();

        return { insight: generatedInsight, message: "Insight generated and saved." };
    } catch (error) {
        console.error("❌ Error generating insights:", error);
        return { error: "Failed to generate AI insights." };
    }
};

module.exports = { generateInsights };
