const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Table'
    },
    numberOfGuests: {
      type: Number,
      required: true
    },
    reservationTime: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
