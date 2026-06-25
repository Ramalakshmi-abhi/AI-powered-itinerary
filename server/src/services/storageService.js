const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Get the public URL for a stored file
 * @param {string} fileName - The stored file name
 * @returns {string} Public URL
 */
const getFileUrl = (fileName) => {
  const port = process.env.PORT || 5000;
  return `http://localhost:${port}/uploads/${fileName}`;
};

/**
 * Upload a file to the active storage provider (local or Vercel Blob)
 * @param {Object} file - Multer file object
 * @returns {Promise<{fileUrl: string, fileName: string}>}
 */
const uploadFile = async (file) => {
  const provider = process.env.STORAGE_PROVIDER || 'local';

  if (provider === 'vercel-blob') {
    const { put } = require('@vercel/blob');
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `uploads/${uuidv4()}${ext}`;
    const blob = await put(uniqueName, file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return {
      fileUrl: blob.url,
      fileName: blob.pathname,
    };
  }

  // Fallback to local (disk storage handles file save, we just return filename and URL)
  const fileName = file.filename;
  return {
    fileUrl: getFileUrl(fileName),
    fileName: fileName,
  };
};

/**
 * Delete a file from the active storage provider (local or Vercel Blob)
 * @param {string} fileIdentifier - The fileName or identifier of the file
 * @param {string} fileUrl - The public URL of the file (required for Vercel Blob delete)
 * @returns {Promise<void>}
 */
const deleteFile = async (fileIdentifier, fileUrl) => {
  const provider = process.env.STORAGE_PROVIDER || 'local';

  if (provider === 'vercel-blob') {
    if (!fileUrl) {
      console.warn('⚠️ No fileUrl provided for Vercel Blob deletion');
      return;
    }
    const { del } = require('@vercel/blob');
    await del(fileUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return;
  }

  // Local file deletion
  const uploadDir = process.env.VERCEL ? '/tmp' : (process.env.UPLOAD_DIR || 'uploads');
  const filePath = path.isAbsolute(fileIdentifier)
    ? fileIdentifier
    : path.resolve(process.cwd(), uploadDir, fileIdentifier);

  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // File doesn't exist — treat as success
          console.warn(`⚠️  File not found for deletion: ${filePath}`);
          return resolve();
        }
        return reject(err);
      }
      resolve();
    });
  });
};

module.exports = { getFileUrl, uploadFile, deleteFile };
