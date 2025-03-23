const mongoose = require("mongoose");

const MenteeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor"
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],
    previous_insights: [{
        text: String,
        date: { type: Date, default: Date.now }
    }],
    mentor_feedback: [{
        text: String,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model("Mentee", MenteeSchema);
