const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MenteeSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    previous_insights: {
        qualitative_trends: [String],
        pattern_detection: [String],
        improvement_areas: [String],
        missed_tasks_text: String
    },
    mentor_feedback: String
});

module.exports = mongoose.model('Mentee', MenteeSchema);
