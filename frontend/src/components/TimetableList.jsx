import React from 'react';

const TimetableList = ({ timetables, onSelect, onDelete }) => {
  const handleSelect = (e) => {
    const selectedId = e.target.value;
    const selectedTimetable = timetables.find(t => t._id === selectedId);
    onSelect(selectedTimetable || null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">Your Timetables</h2>
      <select
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
      {timetables.length > 0 && (
        <button
          onClick={() => onDelete(timetables.find(t => t._id === document.querySelector('select').value)?._id)}
          className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
        >
          Delete Selected Timetable
        </button>
      )}
    </div>
  );
};

export default TimetableList;