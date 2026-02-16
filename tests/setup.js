// tests/setup.js
const mongoose = require('mongoose');

beforeAll(async () => {
  // Ensure we aren't already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_TEST_URI);
  }
});

afterAll(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany();
  }

  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({}); // Crucial: await the deletion
  }
});
