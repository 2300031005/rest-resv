const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Restaurant Reservation API' });
});

// Routes
app.use('/api/auth', authRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
