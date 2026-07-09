import API from './axios';

/**
 * Create a new reservation
 * @param {Object} reservationData
 * @param {string} reservationData.reservationDate - YYYY-MM-DD format
 * @param {string} reservationData.timeSlot - e.g. "18:00-20:00"
 * @param {number} reservationData.guestCount - Party size
 * @returns {Promise<Object>} Backend success response
 */
export const createReservation = async (reservationData) => {
  const { data } = await API.post('/reservations', reservationData);
  return data;
};

/**
 * Get all reservations belonging to the logged-in customer
 * @returns {Promise<Object>} Backend success response
 */
export const getMyReservations = async () => {
  const { data } = await API.get('/reservations/my');
  return data;
};

/**
 * Cancel a customer's own reservation
 * @param {string} id - Reservation ID
 * @returns {Promise<Object>} Backend success response
 */
export const cancelReservation = async (id) => {
  const { data } = await API.delete(`/reservations/${id}`);
  return data;
};

/**
 * Fetch active tables list from the backend
 * @returns {Promise<Object>} Backend success response
 */
export const getTables = async () => {
  const { data } = await API.get('/tables');
  return data;
};
