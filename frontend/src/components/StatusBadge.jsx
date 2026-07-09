import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    BOOKED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    COMPLETED: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const selectedStyle = styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase ${selectedStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
