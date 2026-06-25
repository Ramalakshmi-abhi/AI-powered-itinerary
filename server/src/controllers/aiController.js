const UploadedFile = require('../models/UploadedFile');
const Itinerary = require('../models/Itinerary');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const aiService = require('../services/aiService');

/**
 * @route   POST /api/ai/extract
 * @desc    Re-run AI extraction on a specific uploaded file to populate parsedData
 * @access  Protected
 */
const extractFromFile = asyncHandler(async (req, res) => {
  const { fileId } = req.body;
  if (!fileId) {
    throw new ApiError(400, 'fileId is required');
  }

  const file = await UploadedFile.findOne({ _id: fileId, userId: req.user._id });
  if (!file) {
    throw new ApiError(404, 'File not found');
  }

  if (!file.extractedText) {
    throw new ApiError(400, 'No extracted text available for this file. Please re-upload.');
  }

  const parsedData = await aiService.extractStructuredData(file.extractedText);

  file.parsedData = parsedData;
  await file.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { file, parsedData }, 'Data extracted successfully'));
});

/**
 * @route   POST /api/ai/generate
 * @desc    Generate a full itinerary from one or more uploaded files
 * @access  Protected
 */
const generateItinerary = asyncHandler(async (req, res) => {
  const { fileIds, title, userPreferences } = req.body;

  if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    throw new ApiError(400, 'fileIds array is required and must not be empty');
  }

  if (!title) {
    throw new ApiError(400, 'title is required');
  }

  // Fetch all uploaded files belonging to this user
  const files = await UploadedFile.find({
    _id: { $in: fileIds },
    userId: req.user._id,
  });

  if (files.length === 0) {
    throw new ApiError(404, 'No matching files found for the given IDs');
  }

  // Combine extracted text from all files
  const combinedText = files
    .map((f) => f.extractedText || '')
    .filter(Boolean)
    .join('\n\n---\n\n');

  if (!combinedText.trim()) {
    throw new ApiError(400, 'No extracted text available from the selected files');
  }

  // Step 1: Extract structured data
  const structuredData = await aiService.extractStructuredData(combinedText);

  // Step 2: Generate itinerary
  const generatedData = await aiService.generateItinerary(
    structuredData,
    userPreferences || {}
  );

  // Step 3: Build and save itinerary to DB
  const itinerary = await Itinerary.create({
    userId: req.user._id,
    title: generatedData.title || title,
    destination: generatedData.destination || structuredData.destination || '',
    startDate: structuredData.startDate ? new Date(structuredData.startDate) : undefined,
    endDate: structuredData.endDate ? new Date(structuredData.endDate) : undefined,
    flights: structuredData.flights || [],
    hotels: structuredData.hotels || [],
    trains: structuredData.trains || [],
    activities: [],
    aiSummary: generatedData.aiSummary || '',
    itineraryDays: generatedData.itineraryDays || [],
    recommendations: generatedData.recommendations || {},
    status: 'generated',
    sourceFiles: files.map((f) => f._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { itinerary }, 'Itinerary generated successfully'));
});

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with AI about a specific itinerary
 * @access  Protected
 */
const chatWithItinerary = asyncHandler(async (req, res) => {
  const { itineraryId, message } = req.body;

  if (!itineraryId) {
    throw new ApiError(400, 'itineraryId is required');
  }
  if (!message || !message.trim()) {
    throw new ApiError(400, 'message is required');
  }

  const itinerary = await Itinerary.findOne({
    _id: itineraryId,
    userId: req.user._id,
  });

  if (!itinerary) {
    throw new ApiError(404, 'Itinerary not found');
  }

  const aiResponse = await aiService.chatWithItinerary(itinerary, message);

  return res.status(200).json(
    new ApiResponse(200, { response: aiResponse, itineraryId }, 'Chat response generated')
  );
});

module.exports = { extractFromFile, generateItinerary, chatWithItinerary };
