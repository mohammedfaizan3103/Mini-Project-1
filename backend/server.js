// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// const port = 3000;
// const hostname = '127.0.0.1';

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB (Compass Connection)
// mongoose.connect('mongodb://127.0.0.1:27017/productivise', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log(' MongoDB Connected (Local - Compass)'))
//   .catch(err => console.log(' MongoDB Connection Error:', err));

// // Task Schema
// const TaskSchema = new mongoose.Schema({
//     title: String,
//     description: String,
//     completed: Boolean
// });

// const Task = mongoose.model('Task', TaskSchema);

// // Default Route
// app.get('/', (req, res) => {
//     res.send(' Server is running! Use /tasks to interact.');
// });

// // Get all tasks
// app.get('/tasks', async (req, res) => {
//     const tasks = await Task.find();
//     res.json(tasks);
// });

// // Create a new task
// app.post('/tasks', async (req, res) => {
//     const { title, description, completed } = req.body;
//     const newTask = new Task({ title, description, completed: completed || false });
//     await newTask.save();
//     res.json(newTask);
// });

// // Start Server
// app.listen(port, () => {
//     console.log(`🚀 Server running at http://${hostname}:${port}/`);
// });


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
