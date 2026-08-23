const express = require('express');


const {
  register,
  login,
  getProfile,
  updateProfile,
} = require('../controllers/authController');

const {
  authenticateUser,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get(
  '/profile',
  authenticateUser,
  getProfile,
);

router.put(
  '/profile',
  authenticateUser,
  updateProfile,
);

module.exports = router;