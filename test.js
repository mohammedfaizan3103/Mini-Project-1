router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Failed to destroy session:", err);
            return res.status(500).json({ message: "Logout failed" });
        }
        // Ensure the session is null and the cookie is cleared properly
        res.clearCookie("connect.sid", {
            path: "/",
            httpOnly: true,
            secure: false,         // Set true in production with HTTPS
            sameSite: "lax"
        });
        // Explicitly set the session to null
        req.session = null;

        // Send logout success message after destroying the session
        res.status(200).json({ message: "Logged out successfully" });
    });
});
