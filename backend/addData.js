const mongoose = require("mongoose");
const Mentee = require("./models/Mentee");
const Task = require("./models/Task");

const createSampleData = async () => {
    await mongoose.connect("mongodb://localhost:27017/chronoflow");

    // Create sample tasks
    const tasks = await Task.insertMany([
        {
            title: "Prepare financial report",
            category: "Urgent & Important",
            completed: true,
            date: new Date("2025-03-15"),
            date_completed: new Date("2025-03-18")
        },
        {
            title: "Review project documentation",
            category: "Not Urgent & Important",
            completed: true,
            date: new Date("2025-03-20"),
            date_completed: new Date("2025-03-22")
        },
        {
            title: "Respond to client emails",
            category: "Urgent & Not Important",
            completed: true,
            date: new Date("2025-03-21"),
            date_completed: new Date("2025-03-21")
        },
        {
            title: "Organize shared folders",
            category: "Not Urgent & Not Important",
            completed: true,
            date: new Date("2025-03-25"),
            date_completed: new Date("2025-03-24")
        }
    ]);

    // Create sample mentee
    const mentee = await Mentee.create({
        username: "john_doe",
        password: "password123",
        email: "john.doe@example.com",
        phone: "1234567890",
        tasks: tasks.map(task => task._id),
        previous_insights: {
            qualitative_trends: ["Frequent delays in urgent tasks", "Consistent completion of non-urgent tasks"],
            pattern_detection: ["Urgent administrative tasks are often delayed", "Reporting tasks are frequently late"],
            improvement_areas: ["Better time blocking for urgent tasks", "More efficient delegation of low-priority tasks"],
            missed_tasks_text: "Last week, urgent admin tasks were frequently delayed, indicating a need for improved prioritization."
        },
        mentor_feedback: "Good overall improvement, but you need to communicate delays earlier. Try breaking down large tasks into smaller steps."
    });

    console.log("Sample data created successfully!");
    mongoose.connection.close();
};

createSampleData().catch(console.error);
