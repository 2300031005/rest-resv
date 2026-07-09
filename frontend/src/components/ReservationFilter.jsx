import React, { useState } from 'react';

const ReservationFilter = ({ onFilter, onClear }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (selectedDate) {
      onFilter(selectedDate);
    }
  };

  const handleClearClick = () => {
    setSelectedDate('');
    onClear();
  };

  return (
    <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex-1 w-full">
        <label htmlFor="filter-date" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Filter by Date
        </label>
        <input
          id="filter-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        />
      </div>
      <div className="flex space-x-2 w-full sm:w-auto justify-end">
        <button
          type="submit"
          disabled={!selectedDate}
          className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Filter
        </button>
        <button
          type="button"
          onClick={handleClearClick}
          className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default ReservationFilter;
