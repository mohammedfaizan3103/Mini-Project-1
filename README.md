# ChronoFlow: AI-Powered Productivity and Mentor-Mentee Management System

## 🚀 Overview

**ChronoFlow** is a full-stack AI-driven productivity platform designed to enhance task management, time organization, and mentorship interactions. Built with the **MERN stack** and powered by **Google's Gemini API**, the platform allows users to:

- Prioritize tasks intelligently,
- Create structured timetables,
- Receive AI-generated performance insights,
- Facilitate mentor-mentee collaboration for continuous growth.

This project was developed as part of the Mini-Project-I (22ITC07) curriculum at **CBIT**.

---

## ✨ Core Features

- 🔒 **User Authentication:** Secure login and registration with role-based access control (Mentor / Mentee).
- ✅ **Task Management:** Create, categorize (via Eisenhower Matrix), edit, and track tasks.
- 🗓️ **Timetable Planner:** Design personalized schedules with an intuitive timetable manager.
- 🤖 **AI-Generated Insights:** Analyze user productivity trends and receive improvement suggestions via Generative AI.
- 👥 **Mentor-Mentee Module:** Mentors can monitor mentee progress, provide feedback, and track development through AI reports.
- 📱 **Responsive Design:** Fully optimized for both desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ORM)
- **Authentication:** bcrypt, JWT
- **AI Integration:** Google's Gemini API
- **Dev Tools:** Postman, MongoDB Compass, VS Code, GitHub

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside the backend folder:
```plaintext
MONGO_URI=<your_mongodb_connection_string>
GEMINI_API_KEY=<your_google_generative_ai_api_key>
SESSION_SECRET=<your_session_secret>
```
Start the backend server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧩 Usage Flow

1. **Register** as a Mentor or Mentee.
2. **Login** securely and access your dashboard.
3. **Add and manage tasks** categorized by urgency and importance.
4. **Plan your week** with the Timetable Manager.
5. **Generate personalized AI insights** on task performance.
6. **Mentors provide structured feedback** to mentees for continuous improvement.

---

## 📊 Sample AI Interaction

### Sample Task Data Sent to Gemini API
```json
{
  "tasks_completed": 5,
  "tasks_delayed": 2,
  "average_delay_days": 1.5,
  "urgent_tasks": 3,
  "delayed_urgent_tasks": 1,
  "previous_week": {
    "tasks_completed": 4,
    "tasks_delayed": 3
  },
  "tasks": [
    {
      "category": "urgent_important",
      "content": "Prepare financial report",
      "initial_due_date": "2025-03-10",
      "completed_on": "2025-03-12",
      "delay_days": 2
    },
    {
      "category": "not_urgent_important",
      "content": "Review project documentation",
      "initial_due_date": "2025-03-11",
      "completed_on": "2025-03-13",
      "delay_days": 2
    }
  ],
  "previous_insights": [
    {
      "text": "Improved task completion rate but delays in urgent tasks.",
      "date": "2025-03-01"
    }
  ],
  "mentor_feedback": "Good performance overall. Improve your task prioritization."
}
```

### Sample AI-Generated Insights
```json
{
  "insights": {
    "qualitative_trends": [
      "Frequent delays in urgent tasks",
      "Consistent completion of non-urgent tasks"
    ],
    "pattern_detection": [
      "Urgent administrative tasks are often delayed",
      "Reporting tasks are frequently late"
    ],
    "improvement_areas": [
      "Better time blocking for urgent tasks",
      "More efficient delegation of low-priority tasks"
    ],
    "missed_tasks_text": "Last week, urgent admin tasks were frequently delayed, indicating a need for improved prioritization."
  }
}
```

---

## 📚 Learnings and Achievements

- Gained **full-stack development** expertise (MERN stack).
- Hands-on experience with **Generative AI integration** and **prompt engineering**.
- Implemented secure, real-world **authentication** and **role management**.
- Built collaborative development workflows using **GitHub** and **version control best practices**.

---

## 📄 License

This project is for educational purposes under CBIT’s Mini-Project-I guidelines.  
For inquiries regarding code reuse or extension, please contact the developer.

---


