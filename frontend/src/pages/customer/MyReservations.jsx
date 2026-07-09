import React, { useEffect, useState } from 'react';
import { useReservations } from '../../hooks/useReservations';
import ReservationList from '../../components/ReservationList';
import ConfirmationModal from '../../components/ConfirmationModal';
import Alert from '../../components/ui/Alert';

const MyReservations = () => {
  const { reservations, loading, error, fetchReservations, cancelReservation } = useReservations();
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleCancelClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    setIsModalOpen(false);
    setLocalSuccess('');
    setLocalError('');
    if (!selectedId) return;

    try {
      const response = await cancelReservation(selectedId);
      if (response.success) {
        setLocalSuccess('Reservation cancelled successfully.');
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to cancel reservation.');
    } finally {
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          My Bookings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your table reservations.
        </p>
      </div>

      {localSuccess && <Alert message={localSuccess} type="success" />}
      {localError && <Alert message={localError} type="error" />}
      {error && <Alert message={error} type="error" />}

      <ReservationList
        reservations={reservations}
        loading={loading}
        onCancelClick={handleCancelClick}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation? This action cannot be undone."
        confirmText="Yes, Cancel"
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default MyReservations;
