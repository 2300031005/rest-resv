const express = require('express');
const router = express.Router();

const {
  handleRegister,
  handleLogin,
  handleProfile,
} = require('../controllers/auth.controller');

const {
  registerValidator,
  loginValidator,
} = require('../validators/auth.validator');

const { protect } = require('../middleware/auth.middleware');

// Public Routes
router.post('/register', registerValidator, handleRegister);
router.post('/login', loginValidator, handleLogin);

// Protected Routes
router.get('/profile', protect, handleProfile);

module.exports = router;
