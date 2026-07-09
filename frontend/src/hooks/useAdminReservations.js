import { useState, useCallback } from 'react';
import {
  getAllReservations,
  updateReservation as apiUpdateReservation,
  cancelReservationAsAdmin,
} from '../api/reservation.api';

export const useAdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');

  const fetchReservations = useCallback(async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllReservations(date);
      if (response.success && response.data) {
        setReservations(response.data.reservations);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin reservations.');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUpdateReservation(id, updateData);
      if (response.success) {
        // Refresh local state with updated booking
        setReservations((prev) =>
          prev.map((res) => (res._id === id ? { ...res, ...response.data.reservation } : res))
        );
      }
      return response;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update reservation.';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cancelReservationAsAdmin(id);
      if (response.success) {
        // Mark as cancelled locally
        setReservations((prev) =>
          prev.map((res) => (res._id === id ? { ...res, status: 'CANCELLED' } : res))
        );
      }
      return response;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to cancel reservation.';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    reservations,
    loading,
    error,
    filterDate,
    setFilterDate,
    fetchReservations,
    updateReservation: update,
    cancelReservation: cancel,
  };
};
