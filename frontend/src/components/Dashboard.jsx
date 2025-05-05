import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MentorDashboard from "./MentorDashboard";
import Navbar from "./Navbar";

const Dashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [category, setCategory] = useState("Urgent & Important");
  const [showCompleted, setShowCompleted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { username_ } = useParams();

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
    if (username_ && user?.role !== "mentor") {

    }
    const fetchTasks = async () => {
      setLoading(true);
      console.log(user._id);
      try {
        const response = await axios.get("http://localhost:5000/api/tasks", {
          params: { userId: username_ },
          withCredentials: true
        });
        setTasks(response.data);
        console.log(response.data);
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
          userId: username_,
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

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (user?.role === "mentor") {
    if (!username_) {
      return <MentorDashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Task Dashboard</h2>

          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter Task..."
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={addTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Task
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCompleted"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="showCompleted" className="ml-2 text-gray-700">
                Show Completed Tasks
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div key={cat} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                  {cat}
                </h3>
                <div className="space-y-2">
                  {tasks
                    .filter((task) => task.category === cat && (showCompleted || !task.completed))
                    .map((task) => (
                      <div key={task._id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task._id, task.completed)}
                          disabled={user?.role === "mentor"}
                          className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded 
    ${user?.role === "mentor" ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                        <span className={`ml-3 flex-grow ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                          {task.title}
                        </span>
                        <button
                          onClick={() => deleteTask(task._id)}
                          disabled={user?.role === "mentor"}
                          className={`text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition duration-200
                            ${user?.role === "mentor" ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-red-500" : ""}`}
                          aria-label="Delete task"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;