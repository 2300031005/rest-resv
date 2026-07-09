import React from 'react';
import StatusBadge from './StatusBadge';

const AdminReservationTable = ({ reservations = [], onEditClick, onCancelClick }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden border border-gray-200 md:border-0">
      {/* Desktop Table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3.5 font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3.5 font-semibold text-gray-900">Slot</th>
              <th className="px-6 py-3.5 font-semibold text-gray-900">Customer</th>
              <th className="px-6 py-3.5 font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3.5 font-semibold text-gray-900">Table</th>
              <th className="px-6 py-3.5 font-semibold text-gray-900 text-center">Guests</th>
              <th className="px-6 py-3.5 font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3.5 font-semibold text-gray-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {reservations.map((res) => (
              <tr key={res._id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {formatDate(res.reservationDate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">{res.timeSlot}</td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-900">{res.user?.name || 'Guest'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">{res.user?.email || 'N/A'}</td>
                <td className="whitespace-nowrap px-6 py-4 font-semibold text-indigo-600">
                  {res.table ? `Table ${res.table.tableNumber}` : 'N/A'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center text-gray-700">{res.guestCount}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <StatusBadge status={res.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => onEditClick(res)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  >
                    Edit
                  </button>
                  {res.status === 'BOOKED' && (
                    <button
                      onClick={() => onCancelClick(res._id)}
                      className="text-xs font-semibold text-red-650 text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card List view */}
      <div className="md:hidden divide-y divide-gray-200">
        {reservations.map((res) => (
          <div key={res._id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-900">{formatDate(res.reservationDate)}</p>
                <p className="text-xs text-gray-500">Slot: {res.timeSlot}</p>
              </div>
              <StatusBadge status={res.status} />
            </div>

            <div className="text-xs space-y-1 text-gray-600">
              <p>
                Customer: <strong className="text-gray-900">{res.user?.name || 'Guest'}</strong> ({res.user?.email || 'N/A'})
              </p>
              <p>
                Guests: <strong className="text-gray-900">{res.guestCount}</strong> | Table:{' '}
                <strong className="text-indigo-600">{res.table ? `Table ${res.table.tableNumber}` : 'N/A'}</strong>
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-2 border-t border-gray-50">
              <button
                onClick={() => onEditClick(res)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Edit Details
              </button>
              {res.status === 'BOOKED' && (
                <button
                  onClick={() => onCancelClick(res._id)}
                  className="text-xs font-bold text-red-650 text-red-600 hover:text-red-750 cursor-pointer"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReservationTable;
