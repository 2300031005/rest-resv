import React from 'react';
import ReservationCard from './ReservationCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

const ReservationList = ({ reservations = [], loading = false, onCancelClick }) => {
  if (loading) {
    return <LoadingSpinner message="Fetching your reservations..." />;
  }

  if (reservations.length === 0) {
    return <EmptyState message="No reservations found. Book a table to get started." />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation._id}
          reservation={reservation}
          onCancelClick={onCancelClick}
        />
      ))}
    </div>
  );
};

export default ReservationList;
