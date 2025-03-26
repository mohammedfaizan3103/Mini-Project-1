// middleware/auth.js
const requireAuth = (req, res, next) => {
    if (!req.session.user?._id) {
      return res.status(401).json({ message: "Unauthorized - Please login" });
    }
    next();
  };
  
  const requireRole = (role) => {
    return (req, res, next) => {
      if (req.session.user?.role !== role) {
        return res.status(403).json({ message: `Forbidden - Requires ${role} role` });
      }
      next();
    };
  };
  
  module.exports = { requireAuth, requireRole };