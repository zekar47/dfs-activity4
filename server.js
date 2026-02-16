// server.js
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware to read JSON
app.use(express.json());

// Serve static login page
app.use(express.static('public'));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
