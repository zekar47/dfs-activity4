// routes/userTypeRoutes.js
const express = require('express');
const router = express.Router();
const {
  createUserType,
  getUserTypes,
  updateUserType,
  deleteUserType
} = require('../controllers/userTypeController');

// Standard CRUD routes
router.post('/', createUserType);
router.get('/', getUserTypes);
router.put('/:id', updateUserType);
router.delete('/:id', deleteUserType);

module.exports = router;
