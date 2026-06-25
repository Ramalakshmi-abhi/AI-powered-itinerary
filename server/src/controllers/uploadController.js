const path = require('path');
const UploadedFile = require('../models/UploadedFile');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { extractTextFromFile } = require('../services/ocrService');
const { getFileUrl, deleteFile } = require('../services/storageService');

/**
 * Determine file type category from MIME type
 * @param {string} mimeType
 * @returns {'pdf'|'image'}
 */
const getFileTypeCategory = (mimeType) => {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('image/')) return 'image';
  return 'image';
};

/**
 * @route   POST /api/upload
 * @desc    Upload one or multiple files, run OCR/PDF extraction, save to DB
 * @access  Protected
 */
const uploadFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'No files uploaded');
  }

  const { uploadFile } = require('../services/storageService');
  const results = [];

  for (const file of req.files) {
    // Upload to target storage provider (local or Vercel Blob)
    const { fileUrl, fileName } = await uploadFile(file);

    // Create initial DB record
    const uploadedFile = await UploadedFile.create({
      userId: req.user._id,
      fileName: fileName,
      originalName: file.originalname,
      fileUrl: fileUrl,
      fileType: getFileTypeCategory(file.mimetype),
      mimeType: file.mimetype,
      size: file.size,
      ocrStatus: 'processing',
    });

    try {
      // Run text extraction (using buffer or file path depending on storage)
      const fileSource = file.buffer || (path.isAbsolute(file.path) ? file.path : path.resolve(process.cwd(), file.path));
      const { text, wordCount, confidence } = await extractTextFromFile(
        fileSource,
        file.mimetype
      );

      // Update with extracted text
      uploadedFile.extractedText = text;
      uploadedFile.ocrStatus = 'completed';
      await uploadedFile.save();

      results.push({
        ...uploadedFile.toObject(),
        wordCount,
        confidence,
      });
    } catch (ocrError) {
      console.error(`OCR failed for ${file.originalname}:`, ocrError.message);
      uploadedFile.ocrStatus = 'failed';
      await uploadedFile.save();
      results.push(uploadedFile.toObject());
    }
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { files: results, count: results.length }, 'Files uploaded successfully'));
});

/**
 * @route   GET /api/upload/history
 * @desc    Get paginated upload history for the authenticated user
 * @access  Protected
 */
const getUploadHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [files, total] = await Promise.all([
    UploadedFile.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    UploadedFile.countDocuments({ userId: req.user._id }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      files,
      pagination: { total, page, limit, totalPages, hasNext: page < totalPages },
    }, 'Upload history retrieved successfully')
  );
});

/**
 * @route   GET /api/upload/:id
 * @desc    Get a single uploaded file by ID
 * @access  Protected
 */
const getUpload = asyncHandler(async (req, res) => {
  const file = await UploadedFile.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!file) {
    throw new ApiError(404, 'File not found');
  }

  return res.status(200).json(new ApiResponse(200, { file }, 'File retrieved successfully'));
});

/**
 * @route   DELETE /api/upload/:id
 * @desc    Delete an uploaded file from disk and DB
 * @access  Protected
 */
const deleteUpload = asyncHandler(async (req, res) => {
  const file = await UploadedFile.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!file) {
    throw new ApiError(404, 'File not found');
  }

  // Delete from active storage provider (handles Vercel Blob and local disk)
  await deleteFile(file.fileName, file.fileUrl);

  // Delete from DB
  await UploadedFile.findByIdAndDelete(file._id);

  return res.status(200).json(new ApiResponse(200, null, 'File deleted successfully'));
});

module.exports = { uploadFiles, getUploadHistory, getUpload, deleteUpload };
