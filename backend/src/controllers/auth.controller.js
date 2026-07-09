const asyncHandler = require('express-async-handler');
const { registerUser, loginUser } = require('../services/auth.service');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const handleRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  const result = await registerUser(name, email, password);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: result,
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const handleLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const result = await loginUser(email, password);
  
  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: result,
  });
});

// @desc    Get currently logged in user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const handleProfile = asyncHandler(async (req, res) => {
  const { _id, name, email, role } = req.user;

  res.status(200).json({
    success: true,
    message: 'Profile fetched successfully.',
    data: {
      user: {
        id: _id,
        name,
        email,
        role,
      },
    },
  });
});

module.exports = {
  handleRegister,
  handleLogin,
  handleProfile,
};
