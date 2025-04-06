const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: String,
    startTime: String,
    startModifier: String,
    endTime: String,
    endModifier: String
});

const timetableItemSchema = new mongoose.Schema({
    name: String,
    tasks: [taskSchema],
    _id: String
});

const timetableSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    schedule: [timetableItemSchema],
    name: String
});

module.exports = mongoose.model('Timetable', timetableSchema);