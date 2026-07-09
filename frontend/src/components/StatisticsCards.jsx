import React from 'react';
import Card from './ui/Card';

const StatisticsCards = ({ reservations = [] }) => {
  const total = reservations.length;
  
  // Calculate today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysCount = reservations.filter((r) => {
    // Normal ISO date matches YYYY-MM-DD
    const resDateStr = new Date(r.reservationDate).toISOString().split('T')[0];
    return resDateStr === todayStr;
  }).length;

  const cancelledCount = reservations.filter((r) => r.status === 'CANCELLED').length;

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
      <Card className="!p-4 sm:!p-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Reservations</p>
        <p className="mt-2 text-3xl font-extrabold text-indigo-600">{total}</p>
      </Card>
      
      <Card className="!p-4 sm:!p-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Today's Bookings</p>
        <p className="mt-2 text-3xl font-extrabold text-green-600">{todaysCount}</p>
      </Card>

      <Card className="!p-4 sm:!p-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Cancelled Bookings</p>
        <p className="mt-2 text-3xl font-extrabold text-red-600">{cancelledCount}</p>
      </Card>
    </div>
  );
};

export default StatisticsCards;
