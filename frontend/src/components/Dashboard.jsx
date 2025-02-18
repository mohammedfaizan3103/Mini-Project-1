import React, { useState, useEffect } from "react";
import "../index.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [category, setCategory] = useState("Urgent & Important");
  const [showCompleted, setShowCompleted] = useState(true);
  const userId = sessionStorage.getItem("userId");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Urgent & Important",
    "Urgent & Not Important",
    "Not Urgent & Important",
    "Not Urgent & Not Important"
  ];
  useEffect(() => {
    const updateTask = async () => {
      setLoading(true); // Set loading state before making API call

      try {
        const response = await fetch('http://localhost:5000/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId, // Include userId in the request body
            taskId: tasks[0]?.id, // This assumes you're updating the first task
            completed: tasks[0]?.completed, // Assuming you want to send the completion status
          }),
        });

        // Check if the response is okay
        if (!response.ok) {
          throw new Error('Failed to update task');
        }

        const updatedTask = await response.json(); // Assuming the response is the updated task
        const updatedTasks = tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );
        setTasks(updatedTasks); // Update local task state

        setError(null); // Clear any previous errors
      } catch (error) {
        setError(error.message); // Set error message
        console.error("Error during API request:", error); // More detailed logging
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    if (tasks.length > 0) {
      updateTask(); // Call the async function to update task
    }
  }, [tasks, setTasks, userId]); // Dependencies to trigger the effect when tasks or userId changes


  const addTask = () => {
    if (taskText.trim() !== "") {
      setTasks([...tasks, { title: taskText, category, completed: false }]);
      setTaskText("");
    }
  };

  return (
    <div className="container_">
      <h2>Dashboard</h2>

      <div className="task-input">
        <input
          type="text"
          placeholder="Enter Task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button className="bg-gray-700 text-white" onClick={addTask}>Add Task</button>
        <div className="flex gap-3 items-center">
          <input type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)} />
          <span>Show Completed</span>
        </div>
      </div>

      <div className="task-list">
        {categories.map((cat) => (
          <div key={cat} className="task-category">
            <h3>{cat}</h3>
            {tasks.map((task, index) => {
              if ((task.category !== cat)) {
                return null; // Skip this task if it doesn't match the condition
              }
              if (task.completed && !showCompleted) {
                return null; // Skip this task if it is completed and showCompleted is false
              }
              return (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => {
                      console.log(tasks);
                      console.log(index);
                      const newTasks = [...tasks];
                      newTasks[index].completed = e.target.checked;
                      setTasks(newTasks);
                    }}
                  />
                  <div className={task.completed ? "line-through text-gray-500 task" : "task"}>
                    {task.title}
                  </div>
                </div>
              );
            })}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
