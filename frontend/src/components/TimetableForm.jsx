import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const TimetableForm = ({ selectedTimetable, onSave, onUpdate }) => {
    const [name, setName] = useState('');
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(true)

    // Pre-fill the form when a timetable is selected for editing
    useEffect(() => {
        if (selectedTimetable) {
            setName(selectedTimetable.name);
            setTasks(selectedTimetable.tasks);
        } else {
            setName('');
            setTasks([]);
        }
    }, [selectedTimetable]);

    const formVisibility = () => {
        setShowForm(!showForm)
    }
    // Convert 12-hour time to 24-hour time for comparison
    const convertTo24Hour = (time, modifier) => {
        let [hours, minutes] = time.split(':');
        if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        }
        if (modifier === 'AM' && hours === '12') {
            hours = '00';
        }
        return `${hours}:${minutes}`;
    };

    // Check if a new task overlaps with existing tasks
    const isOverlapping = (newTask, taskList) => {
        const newStart = convertTo24Hour(newTask.startTime, newTask.startModifier);
        const newEnd = convertTo24Hour(newTask.endTime, newTask.endModifier);

        for (const task of taskList) {
            if (task === newTask) continue; // Skip the same task
            const existingStart = convertTo24Hour(task.startTime, task.startModifier);
            const existingEnd = convertTo24Hour(task.endTime, task.endModifier);

            if (
                (newStart >= existingStart && newStart < existingEnd) ||
                (newEnd > existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
            ) {
                return true; // Overlap detected
            }
        }
        return false; // No overlap
    };

    const handleAddTask = () => {
        const newTask = { taskName: '', startTime: '', startModifier: 'AM', endTime: '', endModifier: 'AM' };
        setTasks([...tasks, newTask]);
    };

    const handleTaskChange = (index, field, value) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, [field]: value } : task
        );
        setTasks(updatedTasks);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validate for overlapping tasks
        for (const task of tasks) {
            if (isOverlapping(task, tasks)) {
                setError('Error: Tasks cannot overlap in time.');
                return;
            }
        }

        const timetable = { name, tasks, _id: selectedTimetable?._id || Date.now().toString() };
        if (selectedTimetable) {
            onUpdate(timetable);
        } else {
            onSave(timetable);
        }
        setName('');
        setTasks([]);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className='flex items-center justify-between mb-4'>
                <h2 className="text-2xl font-semibold mb-4">
                    {selectedTimetable ? 'Edit Timetable' : 'Create Timetable'}
                </h2>
                <IoIosArrowUp onClick={formVisibility} style={{display: showForm ? 'block' : 'none'}} className='cursor-pointer' size={24} />
                <IoIosArrowDown onClick={formVisibility} style={{display: !showForm ? 'block' : 'none'}} className='cursor-pointer' size={24} />
            </div>
            <div className='flex flex-col gap-4' style={{ display: showForm ? 'block' : 'none' }}>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Timetable Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4">Tasks</h3>
                    {tasks.map((task, index) => (
                        <div key={index} className="mb-4">
                            <input
                                type="text"
                                placeholder="Task Name"
                                value={task.taskName}
                                onChange={(e) => handleTaskChange(index, 'taskName', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                                required
                            />
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="time"
                                        value={task.startTime}
                                        onChange={(e) => handleTaskChange(index, 'startTime', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        min="01:00"
                                        max="12:59"
                                        required
                                    />
                                    <select
                                        value={task.startModifier}
                                        onChange={(e) => handleTaskChange(index, 'startModifier', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="time"
                                        value={task.endTime}
                                        onChange={(e) => handleTaskChange(index, 'endTime', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        min="01:00"
                                        max="12:59"
                                        required
                                    />
                                    <select
                                        value={task.endModifier}
                                        onChange={(e) => handleTaskChange(index, 'endModifier', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddTask}
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                        Add Task
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white p-2 rounded-lg mt-4 hover:bg-green-600"
                >
                    {selectedTimetable ? 'Update Timetable' : 'Save Timetable'}
                </button>
            </div>
        </form>
    );
};

export default TimetableForm;