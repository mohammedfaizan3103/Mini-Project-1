const express = require("express");
const Task = require("../models/Task");
const { getTaskInsights } = require("../utils/geminiHelper");

const router = express.Router();

//  Fetch All Tasks (GET)
router.get("/", async (req, res) => {
    try {
        // Option 1: Get userId from query parameters
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const tasks = await Task.find({ userId });
        res.json(tasks);
    } catch (error) {
        console.error("GET /tasks error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});
//  Add New Task (POST)
router.post("/", async (req, res) => {
    try {
        const { userId, title, category } = req.body;
        console.log(req.body);
        const task = new Task({ userId, title, category });
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});
//AI insights
// Fetch AI Insights for Tasks
router.get("/insights", async (req, res) => {
    try {
        const tasks = await Task.find();  // Fetch all tasks from the database
        const insights = await getTaskInsights(tasks);  // Get insights from Gemini AI
        res.json({ insights });
    } catch (error) {
        console.error("AI Insights Error:", error);
        res.status(500).json({ error: "Failed to fetch AI insights" });
    }
});


module.exports = router;
