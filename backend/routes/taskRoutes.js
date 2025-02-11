const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

//  Fetch All Tasks (GET)
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
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
        const task = new Task({ userId, title, category });
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
