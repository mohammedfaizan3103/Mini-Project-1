const express = require("express");
const Timetable = require("../models/Timetable");

const router = express.Router();

// Add or Update Timetable
router.post("/", async (req, res) => {
    const { userId, schedule } = req.body;
    await Timetable.findOneAndUpdate({ userId }, { schedule }, { upsert: true });
    res.json({ message: "Timetable updated" });
});

// Get Timetable
router.get("/:userId", async (req, res) => {
    const timetable = await Timetable.findOne({ userId: req.params.userId });
    res.json(timetable);
});

module.exports = router;
