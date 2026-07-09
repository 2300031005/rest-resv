import { useState, useCallback } from 'react';
import {
  getMyReservations,
  createReservation as apiCreateReservation,
  cancelReservation as apiCancelReservation,
} from '../api/reservation.api';

export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyReservations();
      if (response.success && response.data) {
        setReservations(response.data.reservations);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reservations.');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (reservationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCreateReservation(reservationData);
      return response;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to book reservation.';
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
      const response = await apiCancelReservation(id);
      // Update local state by removing/modifying the cancelled reservation
      setReservations((prev) =>
        prev.map((res) => (res._id === id ? { ...res, status: 'CANCELLED' } : res))
      );
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
    fetchReservations,
    createReservation: create,
    cancelReservation: cancel,
  };
};
