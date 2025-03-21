const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Mentee = require("../models/Mentee");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    try {
        // Check if the user already exists in both collections
        const existingMentor = await Mentor.findOne({ email });
        const existingMentee = await Mentee.findOne({ email });

        if (existingMentor || existingMentee) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user based on their role
        if (role === "mentor") {
            const user = new Mentor({ username: name, email, password: hashedPassword, phone });
            await user.save();
        } else if (role === "mentee") {
            const user = new Mentee({ username: name, email, password: hashedPassword, phone });
            await user.save();
        } else {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
        res.json({ token, userId: user._id });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

module.exports = router;
