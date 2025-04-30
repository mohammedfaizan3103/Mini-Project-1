import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TimetableForm from './TimetableForm';
import TimetableList from './TimetableList';
import TimetableView from './TimetableView';

const Timetable = ({ user }) => {
  const [timetables, setTimetables] = useState([]);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load timetables from backend
  const fetchTimetables = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/timetable', {
        withCredentials: true
      });
      // Convert backend format to match your frontend structure
      const formattedTimetables = response.data.schedule || [];
      setTimetables(formattedTimetables);
    } catch (error) {
      console.error("Error fetching timetables:", error);
      setTimetables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTimetables();
    }
  }, [user]);

  // Save timetable to backend
  const handleSaveTimetable = async (timetable) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/timetable',
        { 
          schedule: [...timetables, timetable],
          name: timetable.name // Include the name in the request
        },
        { withCredentials: true }
      );
      setTimetables(response.data.schedule);
      setSelectedTimetable(null);
    } catch (error) {
      console.error("Error saving timetable:", error);
      alert("Failed to save timetable");
    }
  };

  // Update timetable in backend
  const handleUpdateTimetable = async (updatedTimetable) => {
    try {
      const updatedTimetables = timetables.map(t =>
        t._id === updatedTimetable._id ? updatedTimetable : t
      );
      
      const response = await axios.post(
        'http://localhost:5000/api/timetable',
        { schedule: updatedTimetables },
        { withCredentials: true }
      );
      
      setTimetables(response.data.schedule);
      setSelectedTimetable(null);
    } catch (error) {
      console.error("Error updating timetable:", error);
      alert("Failed to update timetable");
    }
  };

  // Delete timetable from backend
  const handleDeleteTimetable = async (id) => {
    try {
      const updatedTimetables = timetables.filter(t => t._id !== id);
      
      const response = await axios.post(
        'http://localhost:5000/api/timetable',
        { schedule: updatedTimetables },
        { withCredentials: true }
      );
      
      setTimetables(response.data.schedule);
      setSelectedTimetable(null);
    } catch (error) {
      console.error("Error deleting timetable:", error);
      alert("Failed to delete timetable");
    }
  };

  if (loading) {
    return <div>Loading timetables...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">Timetable Manager</h1>
      <div className="max-w-4xl mx-auto">
        <TimetableForm
          selectedTimetable={selectedTimetable}
          onSave={handleSaveTimetable}
          onUpdate={handleUpdateTimetable}
        />
        <TimetableList
          timetables={timetables}
          onSelect={setSelectedTimetable}
          onDelete={handleDeleteTimetable}
        />
        {selectedTimetable && <TimetableView timetable={selectedTimetable} />}
      </div>
    </div>
  );
};

export default Timetable;