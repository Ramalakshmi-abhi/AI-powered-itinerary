const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  updateProfile,
  changePassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/user/dashboard
router.get('/dashboard', protect, getDashboardStats);

// PUT /api/user/profile
router.put('/profile', protect, updateProfile);

// PUT /api/user/password
router.put('/password', protect, changePassword);

module.exports = router;
