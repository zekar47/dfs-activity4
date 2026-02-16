// tests/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  const user = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  // Helper function to seed a user if needed for specific tests
  const seedUser = async () => {
    await request(app).post('/api/auth/register').send(user);
  };

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(user.email);
    expect(res.body.password).toBeUndefined(); // Security check: don't return password
  });

  it('should reject registration if the email is already taken', async () => {
    // 1. Seed the user first
    await seedUser();

    // 2. Try to register the same user again
    const res = await request(app)
      .post('/api/auth/register')
      .send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should login successfully with correct credentials', async () => {
    // 1. Ensure user exists in the DB for this specific test
    await seedUser();

    // 2. Attempt login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: user.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should reject login with a wrong password', async () => {
    // 1. Ensure user exists
    await seedUser();

    // 2. Attempt login with bad password
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
