const mongoose = require("mongoose");
const Mentee = require("./models/Mentee");
const Task = require("./models/Task");

const createSampleData = async () => {
    await mongoose.connect("mongodb://localhost:27017/chronoflow");

    // Create sample tasks for User 1
    const tasksUser1 = await Task.insertMany([
        {
            title: "Prepare financial report",
            category: "Urgent & Important",
            completed: true,
            date: new Date("2025-03-10"),
            date_completed: new Date("2025-03-12")
        },
        {
            title: "Review project documentation",
            category: "Not Urgent & Important",
            completed: true,
            date: new Date("2025-03-11"),
            date_completed: new Date("2025-03-13")
        },
        {
            title: "Respond to client emails",
            category: "Urgent & Not Important",
            completed: false,
            date: new Date("2025-03-14"),
            date_completed: null
        },
        {
            title: "Organize shared folders",
            category: "Not Urgent & Not Important",
            completed: true,
            date: new Date("2025-03-15"),
            date_completed: new Date("2025-03-15")
        },
        {
            title: "Team meeting preparation",
            category: "Urgent & Important",
            completed: true,
            date: new Date("2025-03-16"),
            date_completed: new Date("2025-03-17")
        }
    ]);

    // Create sample tasks for User 2
    const tasksUser2 = await Task.insertMany([
        {
            title: "Create marketing plan",
            category: "Urgent & Important",
            completed: true,
            date: new Date("2025-03-09"),
            date_completed: new Date("2025-03-11")
        },
        {
            title: "Social media content scheduling",
            category: "Not Urgent & Important",
            completed: false,
            date: new Date("2025-03-12"),
            date_completed: null
        },
        {
            title: "Customer follow-up calls",
            category: "Urgent & Not Important",
            completed: true,
            date: new Date("2025-03-13"),
            date_completed: new Date("2025-03-13")
        },
        {
            title: "Website content updates",
            category: "Not Urgent & Not Important",
            completed: false,
            date: new Date("2025-03-14"),
            date_completed: null
        },
        {
            title: "Internal training session",
            category: "Urgent & Important",
            completed: true,
            date: new Date("2025-03-15"),
            date_completed: new Date("2025-03-16")
        }
    ]);

    // Create sample mentee 1
    const mentee1 = await Mentee.create({
        username: "john_doe",
        password: "password123",
        email: "john.doe@example.com",
        phone: "1234567890",
        tasks: tasksUser1.map(task => task._id),
        previous_insights: [
            {
                text: "Improved task completion rate but delays in urgent tasks.",
                date: new Date("2025-03-01")
            },
            {
                text: "Better time management for administrative tasks observed.",
                date: new Date("2025-03-08")
            }
        ],
        mentor_feedback: [
            {
                text: "Good performance overall. Improve your task prioritization.",
                date: new Date("2025-03-05")
            },
            {
                text: "Need to communicate delays more proactively.",
                date: new Date("2025-03-12")
            }
        ]
    });

    // Create sample mentee 2
    const mentee2 = await Mentee.create({
        username: "jane_smith",
        password: "securePass456",
        email: "jane.smith@example.com",
        phone: "9876543210",
        tasks: tasksUser2.map(task => task._id),
        previous_insights: [
            {
                text: "Consistently completes marketing-related tasks early.",
                date: new Date("2025-03-02")
            },
            {
                text: "Struggles with website content deadlines.",
                date: new Date("2025-03-09")
            }
        ],
        mentor_feedback: [
            {
                text: "Excellent marketing performance. Improve consistency with content tasks.",
                date: new Date("2025-03-06")
            },
            {
                text: "Focus on balancing creative and administrative work.",
                date: new Date("2025-03-13")
            }
        ]
    });

    console.log("Sample data created successfully!");
    mongoose.connection.close();
};

createSampleData().catch(console.error);
