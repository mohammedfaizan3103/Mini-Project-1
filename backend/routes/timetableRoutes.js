const express = require("express");
const Timetable = require("../models/Timetable");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

// Add or Update Timetable
router.post("/", async (req, res) => {
    try {
        const { schedule, name } = req.body;
        const userId = req.user._id;

        // Convert your frontend timetable format to backend format
        const backendSchedule = schedule.map(t => ({
            name: t.name,
            tasks: t.tasks,
            _id: t._id
        }));

        const updatedTimetable = await Timetable.findOneAndUpdate(
            { userId },
            { 
                schedule: backendSchedule,
                userId,
                name: name || "My Timetable" // Default name if not provided
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json(updatedTimetable);
    } catch (error) {
        console.error("Error updating timetable:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get Timetable
router.get("/", async (req, res) => {
    try {
        const timetable = await Timetable.findOne({ userId: req.user._id });

        if (!timetable) {
            // Return empty structure if no timetable exists
            return res.json({
                schedule: [],
                name: "My Timetable"
            });
        }

        // Convert backend format to frontend format
        const frontendTimetables = timetable.schedule.map(t => ({
            name: t.name,
            tasks: t.tasks,
            _id: t._id || Date.now().toString()
        }));

        res.json({
            schedule: frontendTimetables,
            name: timetable.name
        });
    } catch (error) {
        console.error("Error fetching timetable:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;