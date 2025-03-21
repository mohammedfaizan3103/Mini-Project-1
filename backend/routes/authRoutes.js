const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Mentee = require("../models/Mentee");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    const { username, fullName, email, password, role, phone } = req.body;

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
            const user = new Mentor({ username: username, fullName, email, password: hashedPassword, phone });
            await user.save();
        } else if (role === "mentee") {
            const mentor = await Mentor.findOne({ username: req.body.mentorUsername });
            if (!mentor) {
                return res.status(400).json({ message: "Mentor not found" });
            }
            const user = new Mentee({ username: username, fullName, email, password: hashedPassword, phone, mentor: mentor._id });
            await user.save();
            mentor.mentees.push(user._id);  // Add mentee ID to the mentor's mentees array
            await mentor.save();
        } else {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Select the correct model based on role
        const model = role === "mentor" ? Mentor : Mentee;
        const user = await model.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Store user info in session
        req.session.user = {
            id: user._id,
            email: user.email,
            role: role
        };

        res.status(200).json({ message: "Login successful", user: req.session.user });

    } catch (error) { 
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 🔥 Logout Route
// Logout Route
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Failed to destroy session:", err);
            return res.status(500).json({ message: "Logout failed" });
        }

        // ✅ Ensure the session is null and the cookie is cleared properly
        res.clearCookie("connect.sid", {
            path: "/",
            httpOnly: true,
            secure: false,         // Set true in production with HTTPS
            sameSite: "lax"
        });

        // ✅ Explicitly set the session to null
        req.session = null;

        // ✅ Send logout success message after destroying the session
        res.status(200).json({ message: "Logged out successfully" });
    });
});


  

// 🔥 Check Session Route
router.get("/session", (req, res) => {
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(405).json({ message: "No active session" });
    }
});


module.exports = router;
