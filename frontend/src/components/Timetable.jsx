import React, { useState, useEffect } from 'react';
import TimetableForm from './TimetableForm';
import TimetableList from './TimetableList';
import TimetableView from './TimetableView';

const Timetable = () => {
  const [timetables, setTimetables] = useState([]); // List of all timetables
  const [selectedTimetable, setSelectedTimetable] = useState(null); // Currently selected timetable

  // Load timetables from localStorage on initial render
  useEffect(() => {
    const savedTimetables = JSON.parse(localStorage.getItem('timetables')) || [];
    setTimetables(savedTimetables);
  }, []);

  // Save a new timetable to localStorage
  const handleSaveTimetable = (timetable) => {
    const updatedTimetables = [...timetables, timetable];
    localStorage.setItem('timetables', JSON.stringify(updatedTimetables));
    setTimetables(updatedTimetables);
  };

  // Update an existing timetable in localStorage
  const handleUpdateTimetable = (updatedTimetable) => {
    const updatedTimetables = timetables.map(t =>
      t._id === updatedTimetable._id ? updatedTimetable : t
    );
    localStorage.setItem('timetables', JSON.stringify(updatedTimetables));
    setTimetables(updatedTimetables);
  };

  // Delete a timetable from localStorage
  const handleDeleteTimetable = (id) => {
    const updatedTimetables = timetables.filter(t => t._id !== id);
    localStorage.setItem('timetables', JSON.stringify(updatedTimetables));
    setTimetables(updatedTimetables);
    setSelectedTimetable(null); // Clear selected timetable
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Timetable Manager</h1>
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