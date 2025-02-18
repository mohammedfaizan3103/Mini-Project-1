// utils/geminiHelper.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const client = new GoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function getTaskInsights(tasks) {
    try {
        const response = await client.generateText({
            prompt: `Provide insights on the following tasks: ${JSON.stringify(tasks)}`,
            temperature: 0.7,
            maxTokens: 100,
        });

        return response.text;
    } catch (error) {
        console.error("Error getting AI insights:", error);
        throw error;
    }
}

module.exports = { getTaskInsights };
