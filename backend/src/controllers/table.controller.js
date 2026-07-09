const asyncHandler = require('express-async-handler');
const Table = require('../models/Table');

// @desc    Get all active tables
// @route   GET /api/v1/tables
// @access  Public/Authenticated
const handleGetTables = asyncHandler(async (req, res) => {
  const tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 });

  res.status(200).json({
    success: true,
    message: 'Tables fetched successfully.',
    data: { tables },
  });
});

module.exports = {
  handleGetTables,
};
