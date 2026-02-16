// controllers/productController.js
const Product = require('../models/Product');

// Create product
exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    user: req.user.id
  });

  res.status(201).json(product);
};

// Get products
exports.getProducts = async (req, res) => {
  try {
    // req.user was set in middleware as { id: ... }
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Not found' });
    }

    // Security check (similar to your delete logic)
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Invalid data or ID" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: 'Not found' });

  // Check if the product belongs to the user
  if (product.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this' });
  }

  await product.deleteOne();
  res.json({ message: 'Deleted successfully' });
};
