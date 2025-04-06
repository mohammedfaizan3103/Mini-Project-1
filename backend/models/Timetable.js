const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
    day: String,
    time: String,
    subject: String,
    // Add more fields as needed
});

const TimetableSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    schedule: [EntrySchema]
});

module.exports = mongoose.model("Timetable", TimetableSchema);
