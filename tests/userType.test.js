// tests/userType.test.js
const request = require('supertest');
const app = require('../server');
const UserType = require('../models/UserType');

describe('UserType API', () => {
  // We use unique names so even if parallel tests are running, 
  // we don't collide with other suites.
  const uniqueName = () => `Type-${Date.now()}-${Math.random()}`;

  it('should create a new user type', async () => {
    const name = uniqueName();
    const res = await request(app)
      .post('/api/usertypes')
      .send({
        name: name,
        description: 'Testing creation'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(name);
  });

  it('should fetch all user types', async () => {
    // Clear local collection state specifically for this test 
    // to ensure the count is exactly what we expect.
    await UserType.deleteMany({}); 
    
    await UserType.create([
      { name: uniqueName() },
      { name: uniqueName() }
    ]);

    const res = await request(app).get('/api/usertypes');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should update an existing user type', async () => {
    const ut = await UserType.create({ name: uniqueName(), description: 'Old' });

    const res = await request(app)
      .put(`/api/usertypes/${ut._id}`)
      .send({ description: 'New Description' });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe('New Description');
  });

  it('should delete a user type', async () => {
    const ut = await UserType.create({ name: uniqueName() });

    const res = await request(app).delete(`/api/usertypes/${ut._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User Type deleted');
  });
});
