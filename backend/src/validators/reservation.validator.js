const { body } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const createReservationValidator = [
  body('reservationDate')
    .trim()
    .notEmpty()
    .withMessage('Reservation date is required.')
    .isISO8601()
    .withMessage('Please enter a valid date in ISO 8601 format (YYYY-MM-DD).')
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      // Set hours to 0 to compare dates purely, or check absolute time
      // The requirement is: "must have a future reservation date"
      if (inputDate <= today) {
        throw new Error('Reservation date must be in the future.');
      }
      return true;
    }),

  body('timeSlot')
    .trim()
    .notEmpty()
    .withMessage('Time slot is required.')
    .isIn(['12:00-14:00', '14:00-16:00', '18:00-20:00', '20:00-22:00'])
    .withMessage('Invalid time slot. Allowed slots are: 12:00-14:00, 14:00-16:00, 18:00-20:00, 20:00-22:00.'),

  body('guestCount')
    .notEmpty()
    .withMessage('Guest count is required.')
    .isInt({ min: 1 })
    .withMessage('Guest count must be at least 1.')
    .isInt({ max: 8 })
    .withMessage('Guest count exceeds largest table capacity of 8.'),

  validateRequest,
];

module.exports = {
  createReservationValidator,
};
