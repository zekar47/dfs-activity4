const request = require('supertest');
const app = require('../server');

describe('Health Check', () => {
  it('GET / should return 200', async() => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
