const express = require('express');
const router = express.Router();

const {
  extractFromFile,
  generateItinerary,
  chatWithItinerary,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/extract
router.post('/extract', protect, extractFromFile);

// POST /api/ai/generate
router.post('/generate', protect, generateItinerary);

// POST /api/ai/chat
router.post('/chat', protect, chatWithItinerary);

module.exports = router;
