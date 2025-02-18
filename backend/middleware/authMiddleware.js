const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, "your-secret-key");
        req.user = decoded; // Attach user info to request
        next(); // Proceed to next middleware or route
    } catch (err) {
        res.status(400).json({ error: "Invalid token." });
    }
};
    