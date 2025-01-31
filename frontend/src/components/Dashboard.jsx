import React, { useState } from "react";
import "../index.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [category, setCategory] = useState("Urgent & Important");

  const categories = [
    "Urgent & Important",
    "Urgent & Not Important",
    "Not Urgent & Important",
    "Not Urgent & Not Important"
  ];

  const addTask = () => {
    if (taskText.trim() !== "") {
      setTasks([...tasks, { text: taskText, category }]);
      setTaskText("");
    }
  };

  return (
    <div className="container">
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
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="task-list">
        {categories.map((cat) => (
          <div key={cat} className="task-category">
            <h3>{cat}</h3>
            {tasks
              .filter((task) => task.category === cat)
              .map((task, index) => (
                <div key={index} className="task">{task.text}</div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
