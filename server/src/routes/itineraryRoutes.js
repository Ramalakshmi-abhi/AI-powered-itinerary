const express = require('express');
const router = express.Router();

const {
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  shareItinerary,
  getSharedItinerary,
  duplicateItinerary,
} = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

// PUBLIC — must be before /:id to avoid route conflict
router.get('/share/:code', getSharedItinerary);

// Protected routes
router.get('/', protect, getItineraries);
router.get('/:id', protect, getItinerary);
router.put('/:id', protect, updateItinerary);
router.delete('/:id', protect, deleteItinerary);
router.post('/:id/share', protect, shareItinerary);
router.post('/:id/duplicate', protect, duplicateItinerary);

module.exports = router;
