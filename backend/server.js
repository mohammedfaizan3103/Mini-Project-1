require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const insightsRoutes = require("./routes/insights");

const app = express();
connectDB();

// ✅ CORS configuration
// ✅ Add 'Access-Control-Allow-Credentials' and 'Access-Control-Allow-Headers'
app.use(
  cors({
    origin: "http://localhost:5173",     // Your frontend URL
    credentials: true,                   // Allow credentials
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);


app.use(cookieParser()); // ✅ Parse cookies properly
app.use(express.json());
// Middleware to add CORS credentials header
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


// ✅ Correct session middleware setup (remove duplicate)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,      
      sameSite: "lax",                // Use true in production with HTTPS
      maxAge: 1000 * 60 * 60             // 1-hour session
    }
  })
);

// ✅ Use the correct route prefixes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));
app.use("/api/insights", insightsRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
