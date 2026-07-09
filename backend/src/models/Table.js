const mongoose = require('mongoose');

const tableSchema = mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
      unique: true
    },
    capacity: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'occupied'],
      default: 'available'
    }
  },
  {
    timestamps: true
  }
);

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
