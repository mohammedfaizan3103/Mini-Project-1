const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const Task = require("../models/Task");
const Mentee = require("../models/Mentee");

// Get all tasks (incomplete + today's completed)
router.get("/", requireAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const mentee = await Mentee.findById(req.session.user._id).populate('tasks');
    
    if (!mentee) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Filter tasks: all incomplete + today's completed tasks
    const filteredTasks = mentee.tasks.filter(task => {
      if (!task) return false;
      
      const isTodayCompleted = task.completed && 
                            task.date_completed && 
                            task.date_completed >= today &&
                            task.date_completed < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      
      return !task.completed || isTodayCompleted;
    });

    res.json(filteredTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Add new task
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, category } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    // Create new task
    const newTask = new Task({
      title,
      category,
      completed: false
    });

    await newTask.save();
    
    // Add task reference to mentee
    await Mentee.findByIdAndUpdate(req.session.user._id, {
      $push: { tasks: newTask._id }
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Toggle task completion (checkbox functionality)
router.put("/:id/toggle", requireAuth, async (req, res) => {
  try {
    // Verify task belongs to user
    const mentee = await Mentee.findOne({
      _id: req.session.user._id,
      tasks: req.params.id
    });
    
    if (!mentee) {
      return res.status(404).json({ error: 'Task not found for this user' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Toggle completion status
    const completed = !task.completed;
    const update = {
      completed,
      date_completed: completed ? new Date() : null
    };

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    console.error("Error toggling task:", error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    // Verify task belongs to user
    const mentee = await Mentee.findOneAndUpdate(
      {
        _id: req.session.user._id,
        tasks: req.params.id
      },
      {
        $pull: { tasks: req.params.id }
      }
    );
    
    if (!mentee) {
      return res.status(404).json({ error: 'Task not found for this user' });
    }

    // Delete the task
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;