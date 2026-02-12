require('dotenv').config(); // Load secrets first!
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');

const app = express();

// Middleware
app.use(express.json()); // Allows parsing JSON from the frontend
app.use(cors()); // Allows Vue to connect

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ Connection error:', err));


// --- AUTHENTICATION MIDDLEWARE ---
// We use this function to protect routes (like creating products)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};


// --- ROUTES: AUTHENTICATION ---

// 1. Register User
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'User created!', userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Login User
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    // Check if user exists and password matches
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// --- ROUTES: PRODUCTS (CRUD) ---

// 1. Get All Products (Public - anyone can see)
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 2. Create Product (Protected - only logged in users)
app.post('/api/products', verifyToken, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Update Product (Protected)
app.put('/api/products/:id', verifyToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Delete Product (Protected)
app.delete('/api/products/:id', verifyToken, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});


// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
