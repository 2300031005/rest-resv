const asyncHandler = require('express-async-handler');
const reservationService = require('../services/reservation.service');

// @desc    Create a new reservation
// @route   POST /api/v1/reservations
// @access  Private (Customer/Admin)
const handleCreateReservation = asyncHandler(async (req, res) => {
  const { reservationDate, timeSlot, guestCount } = req.body;
  const userId = req.user._id;

  const reservation = await reservationService.createReservation({
    userId,
    reservationDate,
    timeSlot,
    guestCount,
  });

  res.status(201).json({
    success: true,
    message: 'Reservation created successfully.',
    data: { reservation },
  });
});

// @desc    Get currently logged in user's reservations
// @route   GET /api/v1/reservations/my
// @access  Private (Customer/Admin)
const handleGetMyReservations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const reservations = await reservationService.getCustomerReservations(userId);

  res.status(200).json({
    success: true,
    message: 'Reservations fetched successfully.',
    data: { reservations },
  });
});

// @desc    Cancel user's own reservation
// @route   DELETE /api/v1/reservations/:id
// @access  Private (Customer/Admin)
const handleCancelMyReservation = asyncHandler(async (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user._id;

  const reservation = await reservationService.cancelCustomerReservation(reservationId, userId);

  res.status(200).json({
    success: true,
    message: 'Reservation cancelled successfully.',
    data: { reservation },
  });
});

// @desc    Get all reservations (with optional date query filter)
// @route   GET /api/v1/admin/reservations
// @access  Private (Admin Only)
const handleGetAdminReservations = asyncHandler(async (req, res) => {
  const filterDate = req.query.date; // YYYY-MM-DD
  const reservations = await reservationService.getAdminReservations(filterDate);

  res.status(200).json({
    success: true,
    message: 'All reservations fetched successfully.',
    data: { reservations },
  });
});

// @desc    Update any reservation details or status
// @route   PATCH /api/v1/admin/reservations/:id
// @access  Private (Admin Only)
const handleUpdateAdminReservation = asyncHandler(async (req, res) => {
  const reservationId = req.params.id;
  const updateData = req.body;

  const reservation = await reservationService.updateAdminReservation(reservationId, updateData);

  res.status(200).json({
    success: true,
    message: 'Reservation updated successfully.',
    data: { reservation },
  });
});

// @desc    Cancel any reservation
// @route   DELETE /api/v1/admin/reservations/:id
// @access  Private (Admin Only)
const handleCancelAdminReservation = asyncHandler(async (req, res) => {
  const reservationId = req.params.id;

  const reservation = await reservationService.cancelAdminReservation(reservationId);

  res.status(200).json({
    success: true,
    message: 'Reservation cancelled successfully by admin.',
    data: { reservation },
  });
});

module.exports = {
  handleCreateReservation,
  handleGetMyReservations,
  handleCancelMyReservation,
  handleGetAdminReservations,
  handleUpdateAdminReservation,
  handleCancelAdminReservation,
};
