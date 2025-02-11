const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    userId: { type: String, ref: "User" },
    title: String,
    category: String, // Quadrants (Urgent & Important, etc.)
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", TaskSchema);
