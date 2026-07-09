import React from 'react';

const ReservationCard = ({ reservation, onCancelClick }) => {
  const { _id, reservationDate, timeSlot, guestCount, table, status } = reservation;

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const statusStyles = {
    BOOKED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    COMPLETED: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const badgeStyle = statusStyles[status] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg border border-gray-100 overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-gray-900">{formatDate(reservationDate)}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Time Slot: <strong className="text-gray-700">{timeSlot}</strong></span>
              <span>•</span>
              <span>Guests: <strong className="text-gray-700">{guestCount}</strong></span>
            </div>
            {table && (
              <p className="text-sm text-gray-600">
                Assigned Table: <strong className="text-indigo-600">Table {table.tableNumber}</strong> (Cap: {table.capacity})
              </p>
            )}
          </div>
          <div>
            <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase ${badgeStyle}`}>
              {status}
            </span>
          </div>
        </div>

        {status === 'BOOKED' && onCancelClick && (
          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => onCancelClick(_id)}
              className="text-sm font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
            >
              Cancel Reservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
