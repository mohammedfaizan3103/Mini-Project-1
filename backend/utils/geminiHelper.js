// utils/geminiHelper.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getTaskInsights(tasks) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use the latest available model
        
        const prompt = `Analyze the following tasks and provide insights:
        ${JSON.stringify(tasks)}
        
        - Identify patterns in task completion and delays.
        - Suggest improvements for better productivity.
        - Provide a short AI-generated review.`;

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
