const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];

let storage;
const provider = process.env.STORAGE_PROVIDER || 'local';

if (provider === 'local') {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = process.env.VERCEL ? '/tmp' : (process.env.UPLOAD_DIR || 'uploads');
      const fs = require('fs');
      if (!fs.existsSync(uploadDir)) {
        try {
          fs.mkdirSync(uploadDir, { recursive: true });
        } catch (err) {
          console.error('❌ Failed to create upload directory:', err.message);
        }
      }
      cb(null, uploadDir);
    },
    /**
     * Generate unique filename using UUID + original extension
     */
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${uuidv4()}${ext}`;
      cb(null, uniqueName);
    },
  });
} else {
  // Use memory storage for cloud uploads (Vercel Blob)
  storage = multer.memoryStorage();
}

/**
 * File filter — only allow specified mime types
 */
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    ALLOWED_MIME_TYPES.includes(file.mimetype) &&
    ALLOWED_EXTENSIONS.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Invalid file type. Allowed types: PDF, PNG, JPG, JPEG, WEBP`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;
