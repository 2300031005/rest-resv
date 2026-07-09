import API from './axios';

/**
 * Create a new reservation (Customer/Admin)
 * @param {Object} reservationData
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

/**
 * Get all reservations in the system (Admin only)
 * @param {string} [date] - Optional filter YYYY-MM-DD
 * @returns {Promise<Object>} Backend success response
 */
export const getAllReservations = async (date) => {
  const params = date ? { date } : {};
  const { data } = await API.get('/admin/reservations', { params });
  return data;
};

/**
 * Update any reservation (Admin only)
 * @param {string} id - Reservation ID
 * @param {Object} updateData - Fields to modify
 * @returns {Promise<Object>} Backend success response
 */
export const updateReservation = async (id, updateData) => {
  const { data } = await API.patch(`/admin/reservations/${id}`, updateData);
  return data;
};

/**
 * Cancel any reservation as an administrator (Admin only)
 * @param {string} id - Reservation ID
 * @returns {Promise<Object>} Backend success response
 */
export const cancelReservationAsAdmin = async (id) => {
  const { data } = await API.delete(`/admin/reservations/${id}`);
  return data;
};
