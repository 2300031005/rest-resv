const User = require('../models/User');
const { generateToken } = require('../utils/jwt.util');

/**
 * Register a new user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User data and JWT token
 */
const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email is already registered.');
    error.statusCode = 409; // Conflict
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken({ id: user._id, role: user.role });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Log in an existing user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User data and JWT token
 */
const loginUser = async (email, password) => {
  // Explicitly select the password field since it has select: false by default
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  const token = generateToken({ id: user._id, role: user.role });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
