const express = require("express");
const axios = require("axios");
const connectDB = require("../config/db");
const Mentee = require("../models/Mentee");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res) => {
  const { username, new: fetchNew } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // First get the mentee data with tasks
    const mentee = await Mentee.findOne({ username }).populate("tasks").lean();
    if (!mentee) {
      return res.status(404).json({ error: "Mentee not found" });
    }

    // Generate task data
    const taskData = generateTaskDataJson(mentee, mentee.tasks);

    if (fetchNew === "false") {
        // Return the latest insights from DB if available
        const latestInsight = mentee.previous_insights?.length > 0 
          ? mentee.previous_insights[mentee.previous_insights.length - 1]
          : null;
        
        // Parse the JSON string from the database
        let insightsData = null;
        try {
          insightsData = latestInsight ? JSON.parse(latestInsight.text) : null;
        } catch (e) {
          console.error("Error parsing insights JSON:", e);
          insightsData = null;
        }
        // console.log(insightsData);
        return res.json({
          insights: insightsData ? insightsData : null,  // Match the structure of new insights
          taskData: taskData
        });
      } else {
      // Make new request to the testing endpoint with just the username
      const response = await axios.get(`http://localhost:5000/api/testing/insights?username=${username}`);
      // Return both the insights and the task data
      // console.log("data")
      // console.log(response.data);
      res.json({
        insights: response.data,
        taskData: taskData
      });
    }

  } catch (error) {
    console.error("Error fetching insights:", error);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ 
        error: "Failed to fetch insights",
        details: error.message 
      });
    }
  }
});

// Helper function to generate task data (same as your original)
const generateTaskDataJson = (mentee, tasks) => {
  const completedTasks = tasks.filter(task => task.completed);
  const delayedTasks = completedTasks.filter(task => task.date_completed > task.date);
  const urgentTasks = completedTasks.filter(task => task.category.includes("Urgent"));
  const delayedUrgentTasks = urgentTasks.filter(task => task.date_completed > task.date);

  // Calculate previous week's date range
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const previousWeekTasks = tasks.filter(task =>
    task.date >= oneWeekAgo && task.date <= today
  );

  const previousWeekCompleted = previousWeekTasks.filter(task => task.completed).length;
  const previousWeekDelayed = previousWeekTasks.filter(task => task.date_completed > task.date).length;

  const averageDelayDays = delayedTasks.length > 0
    ? delayedTasks.reduce((sum, task) => sum + Math.ceil((task.date_completed - task.date) / (1000 * 60 * 60 * 24)), 0) / delayedTasks.length
    : 0;

  // Use a maximum of 5 tasks for insights generation
  const limitedTasks = tasks.slice(0, 5).map(task => {
    const delayDays = Math.ceil((task.date_completed - task.date) / (1000 * 60 * 60 * 24));
    return {
      category: task.category.toLowerCase().replace(/ & /g, "_").replace(/ /g, ""),
      content: task.title,
      initial_due_date: task.date.toISOString().split('T')[0],
      completed_on: task.date_completed ? task.date_completed.toISOString().split('T')[0] : null,
      delay_days: delayDays
    };
  });

  return {
    tasks_completed: completedTasks.length,
    tasks_delayed: delayedTasks.length,
    average_delay_days: averageDelayDays,
    urgent_tasks: urgentTasks.length,
    delayed_urgent_tasks: delayedUrgentTasks.length,
    previous_week: {
      tasks_completed: previousWeekCompleted,
      tasks_delayed: previousWeekDelayed
    },
    tasks: limitedTasks,
    previous_insights: mentee.previous_insights,
    mentor_feedback: mentee.mentor_feedback
  };
};

// Route to store mentor feedback
router.post("/feedback", async (req, res) => {
  try {
    const { username, text } = req.body;
    console.log("aiusdfsakdjfasdkjf")
    if (!username || !text) {
      return res.status(400).json({ error: "Username and text are required" });
    }

    const mentee = await Mentee.findOne({ username });
    if (!mentee) {
      return res.status(404).json({ error: "Mentee not found" });
    }

    mentee.mentor_feedback.push({
      text,
      date: new Date()
    });

    await mentee.save();

    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

module.exports = router;