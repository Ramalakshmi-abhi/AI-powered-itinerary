const Itinerary = require('../models/Itinerary');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { generateShareCode } = require('../utils/shareCode');

/**
 * @route   GET /api/itinerary
 * @desc    Get paginated itineraries with search and filter
 * @access  Protected
 */
const getItineraries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { search, status } = req.query;

  const query = { userId: req.user._id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { destination: { $regex: search, $options: 'i' } },
    ];
  }

  if (status && ['draft', 'generated', 'published'].includes(status)) {
    query.status = status;
  }

  const [itineraries, total] = await Promise.all([
    Itinerary.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-itineraryDays -recommendations'),
    Itinerary.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      itineraries,
      pagination: { total, page, limit, totalPages, hasNext: page < totalPages },
    }, 'Itineraries retrieved successfully')
  );
});

/**
 * @route   GET /api/itinerary/:id
 * @desc    Get a single itinerary by ID
 * @access  Protected
 */
const getItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOne({
    _id: req.params.id,
    userId: req.user._id,
  }).populate('sourceFiles', 'originalName fileType fileUrl ocrStatus');

  if (!itinerary) {
    throw new ApiError(404, 'Itinerary not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { itinerary }, 'Itinerary retrieved successfully'));
});

/**
 * @route   PUT /api/itinerary/:id
 * @desc    Update an itinerary
 * @access  Protected
 */
const updateItinerary = asyncHandler(async (req, res) => {
  const allowedFields = [
    'title',
    'destination',
    'startDate',
    'endDate',
    'flights',
    'hotels',
    'trains',
    'activities',
    'aiSummary',
    'itineraryDays',
    'recommendations',
    'status',
    'isPublic',
  ];

  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const itinerary = await Itinerary.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!itinerary) {
    throw new ApiError(404, 'Itinerary not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { itinerary }, 'Itinerary updated successfully'));
});

/**
 * @route   DELETE /api/itinerary/:id
 * @desc    Hard delete an itinerary
 * @access  Protected
 */
const deleteItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!itinerary) {
    throw new ApiError(404, 'Itinerary not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Itinerary deleted successfully'));
});

/**
 * @route   POST /api/itinerary/:id/share
 * @desc    Generate a share code and make itinerary public
 * @access  Protected
 */
const shareItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!itinerary) {
    throw new ApiError(404, 'Itinerary not found');
  }

  // Generate unique share code
  let shareCode;
  let isUnique = false;
  while (!isUnique) {
    shareCode = generateShareCode();
    const existing = await Itinerary.findOne({ shareCode });
    if (!existing) isUnique = true;
  }

  itinerary.shareCode = shareCode;
  itinerary.isPublic = true;
  itinerary.status = 'published';
  await itinerary.save();

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const shareUrl = `${clientUrl}/shared/${shareCode}`;

  return res.status(200).json(
    new ApiResponse(200, { shareCode, shareUrl, itinerary }, 'Itinerary shared successfully')
  );
});

/**
 * @route   GET /api/itinerary/share/:code
 * @desc    Get a publicly shared itinerary by share code (no auth required)
 * @access  Public
 */
const getSharedItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOne({
    shareCode: req.params.code,
    isPublic: true,
  }).populate('sourceFiles', 'originalName fileType');

  if (!itinerary) {
    throw new ApiError(404, 'Shared itinerary not found or no longer available');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { itinerary }, 'Shared itinerary retrieved successfully'));
});

/**
 * @route   POST /api/itinerary/:id/duplicate
 * @desc    Create a copy of an itinerary
 * @access  Protected
 */
const duplicateItinerary = asyncHandler(async (req, res) => {
  const original = await Itinerary.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!original) {
    throw new ApiError(404, 'Itinerary not found');
  }

  const originalObj = original.toObject();
  delete originalObj._id;
  delete originalObj.shareCode;
  delete originalObj.createdAt;
  delete originalObj.updatedAt;

  const duplicate = await Itinerary.create({
    ...originalObj,
    title: `Copy of ${original.title}`,
    isPublic: false,
    status: 'draft',
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { itinerary: duplicate }, 'Itinerary duplicated successfully'));
});

module.exports = {
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  shareItinerary,
  getSharedItinerary,
  duplicateItinerary,
};
