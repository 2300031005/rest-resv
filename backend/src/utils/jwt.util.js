const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing.');
}

/**
 * Generate a JWT token with the specified payload (id and role)
 * @param {Object} userPayload
 * @param {string} userPayload.id
 * @param {string} userPayload.role
 * @returns {string} Signed JWT token
 */
const generateToken = ({ id, role }) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Verify a JWT token
 * @param {string} token
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
