const express = require('express');
const router = express.Router();

const {
  uploadFiles,
  getUploadHistory,
  getUpload,
  deleteUpload,
} = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { uploadLimiter } = require('../middleware/rateLimiter');
const upload = require('../config/multer');

// POST /api/upload — upload multiple files (max 10)
router.post(
  '/',
  protect,
  uploadLimiter,
  upload.array('files', 10),
  uploadFiles
);

// GET /api/upload/history — paginated upload history
router.get('/history', protect, getUploadHistory);

// GET /api/upload/:id
router.get('/:id', protect, getUpload);

// DELETE /api/upload/:id
router.delete('/:id', protect, deleteUpload);

module.exports = router;
