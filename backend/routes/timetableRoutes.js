const express = require("express");
const Timetable = require("../models/Timetable");

const router = express.Router();

// Add or Update Timetable
router.post("/", async (req, res) => {
    try {
        const { userId, schedule } = req.body;

        if (!userId || !schedule) {
            return res.status(400).json({ error: "userId and schedule are required" });
        }

        await Timetable.findOneAndUpdate(
            { userId },
            { schedule },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({ message: "Timetable updated successfully" });
    } catch (error) {
        console.error("Error updating timetable:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get Timetable
router.get("/:userId", async (req, res) => {
    try {
        const timetable = await Timetable.findOne({ userId: req.params.userId });

        if (!timetable) {
            return res.status(404).json({ error: "Timetable not found" });
        }

        res.json(timetable);
    } catch (error) {
        console.error("Error fetching timetable:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
