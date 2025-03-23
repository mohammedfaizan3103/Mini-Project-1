const express = require("express");
const { generateInsights } = require("../utils/insights");
const Insight = require("../models/Insight");

const router = express.Router();

// Generate and store AI insights
router.post("/generate", async (req, res) => {
    const { userId, taskData } = req.body;

    if (!userId || !taskData) {
        return res.status(400).json({ error: "User ID and task data required." });
    }

    const insights = await generateInsights(userId, taskData);
    res.json(insights);
});

// Fetch past insights for a user
router.get("/:userId", async (req, res) => {
    try {
        const insights = await Insight.find({ userId }).sort({ createdAt: -1 });
        res.json(insights);
    } catch (error) {
        console.error("Error fetching insights:", error);
        res.status(500).json({ error: "Failed to fetch insights." });
    }
});

module.exports = router;
