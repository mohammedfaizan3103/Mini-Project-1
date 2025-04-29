const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const Task = require("../models/Task");
const Mentee = require("../models/Mentee");
const Mentor = require("../models/Mentor");

router.get("/get-mentees", requireAuth, async (req, res) => {
    try{
        const mentor = await Mentor.findById(req.session.user._id).populate('mentees');
        if (!mentor) {
            return res.status(404).json({ error: 'Mentor not found' });
        }
        // console.log(mentor.mentees)
        res.json(mentor.mentees);
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;