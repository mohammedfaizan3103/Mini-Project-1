// Dashboard.js (frontend)
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Dashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [category, setCategory] = useState("Urgent & Important");
  const [showCompleted, setShowCompleted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = [
    "Urgent & Important",
    "Urgent & Not Important",
    "Not Urgent & Important",
    "Not Urgent & Not Important"
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/tasks", {
          withCredentials: true
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, navigate]);

  const addTask = async () => {
    if (taskText.trim() === "") return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        { 
          title: taskText,
          category 
        },
        { 
          withCredentials: true 
        }
      );

      setTasks((prev) => [...prev, response.data]);
      setTaskText("");
    } catch (error) {
      console.error("Failed to add task:", error);
      setError("Failed to add task.");
    }
  };

  const toggleTaskCompletion = async (taskId, currentlyCompleted) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/toggle`,
        {},
        { 
          withCredentials: true 
        }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? response.data : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      setError("Failed to update task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/${taskId}`,
        { 
          withCredentials: true 
        }
      );

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError("Failed to delete task.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container_">
      <h2>Dashboard</h2>

      <div className="task-input">
        <input
          type="text"
          placeholder="Enter Task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button className="bg-gray-700 text-white" onClick={addTask}>Add Task</button>

        <div className="flex gap-3 items-center">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
          />
          <span>Show Completed</span>
        </div>
      </div>

      <div className="task-list">
        {categories.map((cat) => (
          <div key={cat} className="task-category">
            <h3>{cat}</h3>
            {tasks
              .filter((task) => task.category === cat && (showCompleted || !task.completed))
              .map((task) => (
                <div key={task._id} className="flex items-center gap-2 my-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task._id, task.completed)}
                    className="mr-2"
                  />
                  <div className={`flex-grow ${task.completed ? "line-through text-gray-500" : ""}`}>
                    {task.title}
                  </div>
                  <button 
                    onClick={() => deleteTask(task._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      {error && <div className="error mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
    </div>
  );
};

export default Dashboard;