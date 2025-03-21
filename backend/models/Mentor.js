const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MentorSchema = new Schema({
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
    mentees: [{
        type: Schema.Types.ObjectId,
        ref: 'Mentee'
    }]
});

module.exports = mongoose.model('Mentor', MentorSchema);