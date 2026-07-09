const express = require('express');
const router = express.Router();
const { handleGetTables } = require('../controllers/table.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/tables', protect, handleGetTables);

module.exports = router;
