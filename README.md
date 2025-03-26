# Mini-Project-1

## Overview

This project is a comprehensive task management and timetable application designed to enhance productivity and organization. Built with a React frontend and an Express backend, it allows users to register as mentors or mentees, manage their tasks efficiently, and generate insightful performance reviews using AI. The application supports a mentor-mentee relationship, enabling mentors to provide feedback and track the progress of their mentees.

## Features

- **User Registration and Login**: Secure user authentication with role-based access for mentors and mentees.
- **Task Management**: Create, update, and delete tasks categorized by urgency and importance. Tasks can be marked as completed or pending.
- **Timetable Management**: Manage daily schedules with a user-friendly interface to add, edit, and view timetables.
- **AI-Generated Performance Insights**: Utilize AI to generate detailed performance reviews, highlighting trends, patterns, and areas for improvement based on task data.
- **Mentor-Mentee Relationship Management**: Mentors can provide feedback, track mentee progress, and view AI-generated insights to guide mentees effectively.
- **Responsive Design**: The application is designed to be responsive, ensuring a seamless experience across different devices.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file with the following content:
   ```plaintext
   MONGO_URI=<your_mongodb_connection_string>
   GEMINI_API_KEY=<your_google_generative_ai_api_key>
   SESSION_SECRET=<your_session_secret>
   ```

4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the frontend development server:
   ```sh
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Register as a mentor or mentee.
3. Log in with your credentials.
4. Manage your tasks and timetables.
5. Generate performance insights.

## Sample Outputs for AI Generated Insights

### Sample Task Data that will be calculated and provided to AI

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

