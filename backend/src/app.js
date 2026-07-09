const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base Route API Health check
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Restaurant Reservation Management API - v1 Active.',
  });
});

// Mounted Routes
app.use('/api/v1/auth', authRoutes);

// Catch 404 routes and forward to error handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
