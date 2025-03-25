import React, { useState } from 'react';

const TimetableList = ({ timetables, onSelect, onDelete }) => {
  const [selectedId, setSelectedId] = useState('');

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    const selectedTimetable = timetables.find(t => t._id === id);
    onSelect(selectedTimetable || null);
  };

  const handleDelete = () => {
    if (selectedId) {
      onDelete(selectedId);
      setSelectedId(''); // Reset the selection after deletion
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">Your Timetables</h2>
      <select
        value={selectedId}
        onChange={handleSelect}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
      >
        <option value="">Select a Timetable</option>
        {timetables.map(timetable => (
          <option key={timetable._id} value={timetable._id}>
            {timetable.name}
          </option>
        ))}
      </select>
      {selectedId && (
        <button
          onClick={handleDelete}
          className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
        >
          Delete Selected Timetable
        </button>
      )}
    </div>
  );
};

export default TimetableList;