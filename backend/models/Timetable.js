const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    schedule: Array // Array of timetable entries
});

module.exports = mongoose.model("Timetable", TimetableSchema);
