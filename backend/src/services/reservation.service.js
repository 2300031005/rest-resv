const Table = require('../models/Table');
const Reservation = require('../models/Reservation');

/**
 * Normalizes a date to midnight UTC (00:00:00.000Z)
 * @param {string|Date} dateVal 
 * @returns {Date}
 */
const normalizeDate = (dateVal) => {
  const d = new Date(dateVal);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Allocate a suitable table based on the allocation algorithm
 */
const allocateTable = async (normalizedDate, timeSlot, guestCount) => {
  // 1. Fetch active tables
  const activeTables = await Table.find({ isActive: true });

  // 2. Filter capacity >= guestCount
  // 3. Sort by capacity ascending, then tableNumber ascending to keep it deterministic
  const suitableTables = activeTables
    .filter((table) => table.capacity >= guestCount)
    .sort((a, b) => a.capacity - b.capacity || a.tableNumber - b.tableNumber);

  // 4 & 5 & 6. Iterate and find the first available table
  for (const table of suitableTables) {
    const isOccupied = await Reservation.findOne({
      table: table._id,
      reservationDate: normalizedDate,
      timeSlot: timeSlot,
      status: { $ne: 'CANCELLED' }, // Cancelled reservations do not block bookings
    });

    if (!isOccupied) {
      return table; // Smallest suitable free table found
    }
  }

  // 7. If no table is available, throw 409 Conflict
  const error = new Error('No tables available for the selected date and time slot.');
  error.statusCode = 409;
  throw error;
};

/**
 * Create a new reservation
 */
const createReservation = async ({ userId, reservationDate, timeSlot, guestCount }) => {
  const normalizedDate = normalizeDate(reservationDate);

  // Find and allocate a table
  const allocatedTable = await allocateTable(normalizedDate, timeSlot, guestCount);

  const reservation = await Reservation.create({
    user: userId,
    table: allocatedTable._id,
    reservationDate: normalizedDate,
    timeSlot,
    guestCount,
    status: 'BOOKED',
  });

  return reservation;
};

/**
 * View own reservations (customer)
 */
const getCustomerReservations = async (userId) => {
  return await Reservation.find({ user: userId })
    .populate('table')
    .sort({ reservationDate: 1, timeSlot: 1 });
};

/**
 * Cancel own reservation (customer)
 */
const cancelCustomerReservation = async (reservationId, userId) => {
  const reservation = await Reservation.findOne({ _id: reservationId, user: userId });
  if (!reservation) {
    const error = new Error('Reservation not found or unauthorized.');
    error.statusCode = 404;
    throw error;
  }

  reservation.status = 'CANCELLED';
  await reservation.save();
  return reservation;
};

/**
 * View all reservations (admin)
 */
const getAdminReservations = async (filterDate) => {
  const query = {};
  if (filterDate) {
    query.reservationDate = normalizeDate(filterDate);
  }

  return await Reservation.find(query)
    .populate('user', 'name email role')
    .populate('table')
    .sort({ reservationDate: 1, timeSlot: 1 });
};

/**
 * Update any reservation (admin)
 */
const updateAdminReservation = async (reservationId, updateData) => {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    const error = new Error('Reservation not found.');
    error.statusCode = 404;
    throw error;
  }

  // If modifying details that affect table allocation, re-run allocation
  const isDetailsChanged =
    (updateData.reservationDate && normalizeDate(updateData.reservationDate).getTime() !== reservation.reservationDate.getTime()) ||
    (updateData.timeSlot && updateData.timeSlot !== reservation.timeSlot) ||
    (updateData.guestCount && updateData.guestCount !== reservation.guestCount);

  if (isDetailsChanged) {
    const nextDate = updateData.reservationDate ? normalizeDate(updateData.reservationDate) : reservation.reservationDate;
    const nextSlot = updateData.timeSlot || reservation.timeSlot;
    const nextGuests = updateData.guestCount || reservation.guestCount;

    // Allocate new table (temporarily ignoring current reservation in conflict check to allow same table reassignment)
    // Fetch active tables
    const activeTables = await Table.find({ isActive: true });
    const suitableTables = activeTables
      .filter((table) => table.capacity >= nextGuests)
      .sort((a, b) => a.capacity - b.capacity || a.tableNumber - b.tableNumber);

    let allocatedTable = null;
    for (const table of suitableTables) {
      const isOccupied = await Reservation.findOne({
        _id: { $ne: reservationId }, // Ignore this reservation itself
        table: table._id,
        reservationDate: nextDate,
        timeSlot: nextSlot,
        status: { $ne: 'CANCELLED' },
      });

      if (!isOccupied) {
        allocatedTable = table;
        break;
      }
    }

    if (!allocatedTable) {
      const error = new Error('No tables available for the selected date and time slot.');
      error.statusCode = 409;
      throw error;
    }

    reservation.table = allocatedTable._id;
    reservation.reservationDate = nextDate;
    reservation.timeSlot = nextSlot;
    reservation.guestCount = nextGuests;
  }

  // Update status if provided
  if (updateData.status) {
    reservation.status = updateData.status;
  }

  await reservation.save();
  return reservation;
};

/**
 * Cancel any reservation (admin)
 */
const cancelAdminReservation = async (reservationId) => {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    const error = new Error('Reservation not found.');
    error.statusCode = 404;
    throw error;
  }

  reservation.status = 'CANCELLED';
  await reservation.save();
  return reservation;
};

module.exports = {
  createReservation,
  getCustomerReservations,
  cancelCustomerReservation,
  getAdminReservations,
  updateAdminReservation,
  cancelAdminReservation,
};
