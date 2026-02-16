const request = require('supertest');
const mongoose = require('mongoose')
const app = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

describe('Product API', () => {
  let token;
  let userId;

  // Setup: Create a user and a token before running product tests
  beforeEach(async () => {
    const uniqueEmail = `owner-${Date.now()}-${Math.random()}@example.com`;
    const user = await User.create({
      name: 'Product Owner',
      email: uniqueEmail,
      password: 'hashedpassword'
    });
    userId = user._id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should create a product when authenticated', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Gaming Mouse',
        description: 'High DPI wireless mouse',
        price: 59.99
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Gaming Mouse');
    expect(res.body.user).toBe(userId.toString());
  });

  it('should deny access if no token is provided', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Stealth Product', price: 10 });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('No token provided');
  });

  it('should only fetch products belonging to the logged-in user', async () => {
    // Use .create but ensure the user field is the exact same variable used in the token
    await Product.create({ 
      name: 'My Item', 
      price: 50, 
      user: userId 
    });

    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('should update a product successfully', async () => {
    const product = await Product.create({ name: 'Old Name', price: 20, user: userId });

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name', price: 25 });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('New Name');
    expect(res.body.price).toBe(25);
  });

  it('should delete a product successfully', async () => {
    const product = await Product.create({ name: 'To Be Deleted', price: 10, user: userId });

    const res = await request(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Deleted successfully');

    // Double check it's gone from DB
    const findDeleted = await Product.findById(product._id);
    expect(findDeleted).toBeNull();
  });
});
