import React, { useEffect, useState } from 'react';
import { useAdminReservations } from '../../hooks/useAdminReservations';
import AdminReservationTable from '../../components/AdminReservationTable';
import ReservationFilter from '../../components/ReservationFilter';
import ReservationEditModal from '../../components/ReservationEditModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminReservations = () => {
  const {
    reservations,
    loading,
    error,
    fetchReservations,
    updateReservation,
    cancelReservation,
  } = useAdminReservations();

  const [editingRes, setEditingRes] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [cancelId, setCancelId] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [activeFilterDate, setActiveFilterDate] = useState('');

  // Fetch all reservations on mount
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleFilter = (date) => {
    setActiveFilterDate(date);
    setLocalSuccess('');
    setLocalError('');
    fetchReservations(date);
  };

  const handleClearFilter = () => {
    setActiveFilterDate('');
    setLocalSuccess('');
    setLocalError('');
    fetchReservations();
  };

  const handleEditClick = (reservation) => {
    setEditingRes(reservation);
    setIsEditOpen(true);
  };

  const handleConfirmEdit = async (updateData) => {
    setIsEditOpen(false);
    setLocalSuccess('');
    setLocalError('');
    if (!editingRes) return;

    try {
      await updateReservation(editingRes._id, updateData);
      setLocalSuccess('Reservation updated successfully.');
      // Refresh list to keep everything fully synced
      fetchReservations(activeFilterDate);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to update reservation.');
    } finally {
      setEditingRes(null);
    }
  };

  const handleCancelClick = (id) => {
    setCancelId(id);
    setIsCancelOpen(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelOpen(false);
    setLocalSuccess('');
    setLocalError('');
    if (!cancelId) return;

    try {
      await cancelReservation(cancelId);
      setLocalSuccess('Reservation cancelled successfully by admin.');
      fetchReservations(activeFilterDate);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to cancel reservation.');
    } finally {
      setCancelId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Manage Reservations
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Search, filter, update details, or cancel restaurant bookings globally.
        </p>
      </div>

      {/* Date Filter Bar */}
      <ReservationFilter onFilter={handleFilter} onClear={handleClearFilter} />

      {/* Alerts */}
      {localSuccess && <Alert message={localSuccess} type="success" />}
      {localError && <Alert message={localError} type="error" />}
      {error && <Alert message={error} type="error" />}

      {/* Tables & Lists */}
      {loading && reservations.length === 0 ? (
        <LoadingSpinner message="Fetching reservations..." />
      ) : reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">No reservations found matching search query.</p>
        </div>
      ) : (
        <AdminReservationTable
          reservations={reservations}
          onEditClick={handleEditClick}
          onCancelClick={handleCancelClick}
        />
      )}

      {/* Edit Modal */}
      <ReservationEditModal
        isOpen={isEditOpen}
        reservation={editingRes}
        onConfirm={handleConfirmEdit}
        onCancel={() => {
          setIsEditOpen(false);
          setEditingRes(null);
        }}
      />

      {/* Cancellation Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCancelOpen}
        title="Cancel Reservation (Admin)"
        message="Are you sure you want to cancel this reservation? An automated alert will free up the table for new client bookings."
        confirmText="Yes, Cancel Booking"
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setIsCancelOpen(false);
          setCancelId(null);
        }}
      />
    </div>
  );
};

export default AdminReservations;
