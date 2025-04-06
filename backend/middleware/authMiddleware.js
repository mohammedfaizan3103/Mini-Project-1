// middleware/authMiddleware.js

module.exports = (req, res, next) => {
    // Check if user session exists
    if (!req.session.user) {
        return res.status(401).json({ 
            success: false,
            message: "Unauthorized: No active session" 
        });
    }

    // Verify the session user data structure
    if (!req.session.user._id || !req.session.user.username || !req.session.user.role) {
        return res.status(401).json({
            success: false,
            message: "Invalid session data"
        });
    }

    // Attach user to request object
    req.user = {
        _id: req.session.user._id,
        username: req.session.user.username,
        email: req.session.user.email,
        role: req.session.user.role,
        mentor: req.session.user.mentor // For mentees
    };

    // Proceed to the next middleware/route handler
    next();
};