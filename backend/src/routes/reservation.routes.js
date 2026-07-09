const express = require('express');
const router = express.Router();

const {
  handleCreateReservation,
  handleGetMyReservations,
  handleCancelMyReservation,
  handleGetAdminReservations,
  handleUpdateAdminReservation,
  handleCancelAdminReservation,
} = require('../controllers/reservation.controller');

const { createReservationValidator } = require('../validators/reservation.validator');
const { protect, authorize } = require('../middleware/auth.middleware');

// ==========================================
// Customer Reservation Routes
// ==========================================
router.post('/reservations', protect, createReservationValidator, handleCreateReservation);
router.get('/reservations/my', protect, handleGetMyReservations);
router.delete('/reservations/:id', protect, handleCancelMyReservation);

// ==========================================
// Admin Reservation Routes
// ==========================================
router.get('/admin/reservations', protect, authorize('admin'), handleGetAdminReservations);
router.patch('/admin/reservations/:id', protect, authorize('admin'), handleUpdateAdminReservation);
router.delete('/admin/reservations/:id', protect, authorize('admin'), handleCancelAdminReservation);

module.exports = router;
