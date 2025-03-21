const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        enum: [
            "Urgent & Important",
            "Urgent & Not Important",
            "Not Urgent & Important",
            "Not Urgent & Not Important"
        ],
        required: true
    },
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    date_completed: { type: Date, default: null }
});

module.exports = mongoose.model("Task", TaskSchema);
