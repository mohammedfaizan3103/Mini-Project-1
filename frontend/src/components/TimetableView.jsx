import React from 'react';

const TimetableView = ({ timetable }) => {
  // Convert 12-hour time to 24-hour time
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

  // Convert 24-hour time to 12-hour time with AM/PM
  const convertTo12Hour = (time) => {
    let [hours, minutes] = time.split(':');
    let modifier = 'AM';
    if (hours >= 12) {
      modifier = 'PM';
    }
    if (hours > 12) {
      hours = hours - 12;
    }
    if (hours === '00') {
      hours = '12';
    }
    return `${hours}:${minutes} ${modifier}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{timetable.name}</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border border-gray-300">Task</th>
            <th className="p-2 border border-gray-300">Start Time</th>
            <th className="p-2 border border-gray-300">End Time</th>
          </tr>
        </thead>
        <tbody>
          {timetable.tasks.map((task, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="p-2 border border-gray-300">{task.taskName}</td>
              <td className="p-2 border border-gray-300">
                {convertTo12Hour(convertTo24Hour(task.startTime, task.startModifier))}
              </td>
              <td className="p-2 border border-gray-300">
                {convertTo12Hour(convertTo24Hour(task.endTime, task.endModifier))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableView;