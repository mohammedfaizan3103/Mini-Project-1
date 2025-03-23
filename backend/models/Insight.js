const mongoose = require("mongoose");

const InsightsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tasksCompleted: { type: Number, required: true },
    tasksDelayed: { type: Number, required: true },
    averageDelayHours: { type: Number, required: true },
    urgentTasks: { type: Number, required: true },
    delayedUrgentTasks: { type: Number, required: true },
    previousWeek: {
        tasksCompleted: { type: Number, required: true },
        tasksDelayed: { type: Number, required: true },
    },
    generatedInsight: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Insight", InsightsSchema);
