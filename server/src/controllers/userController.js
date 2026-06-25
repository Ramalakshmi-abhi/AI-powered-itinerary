const User = require('../models/User');
const Itinerary = require('../models/Itinerary');
const UploadedFile = require('../models/UploadedFile');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @route   GET /api/user/dashboard
 * @desc    Get dashboard statistics for authenticated user
 * @access  Protected
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  const [
    totalTrips,
    documentsUploaded,
    sharedTrips,
    upcomingTrips,
    recentItineraries,
    recentUploads,
  ] = await Promise.all([
    Itinerary.countDocuments({ userId }),
    UploadedFile.countDocuments({ userId }),
    Itinerary.countDocuments({ userId, isPublic: true }),
    Itinerary.countDocuments({ userId, startDate: { $gte: now } }),
    Itinerary.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title destination status createdAt startDate'),
    UploadedFile.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('originalName fileType ocrStatus createdAt'),
  ]);

  const recentActivity = [
    ...recentItineraries.map((i) => ({
      type: 'itinerary',
      title: i.title,
      subtitle: i.destination,
      status: i.status,
      date: i.createdAt,
    })),
    ...recentUploads.map((u) => ({
      type: 'upload',
      title: u.originalName,
      subtitle: u.fileType,
      status: u.ocrStatus,
      date: u.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return res.status(200).json(
    new ApiResponse(200, {
      totalItineraries: totalTrips,
      totalUploads: documentsUploaded,
      sharedCount: sharedTrips,
      upcomingCount: upcomingTrips,
      stats: {
        totalTrips,
        documentsUploaded,
        sharedTrips,
        upcomingTrips,
      },
      recentActivity,
    }, 'Dashboard stats retrieved successfully')
  );
});

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile fields
 * @access  Protected
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, profileImage } = req.body;

  const updateFields = {};
  if (fullName !== undefined) updateFields.fullName = fullName.trim();
  if (profileImage !== undefined) updateFields.profileImage = profileImage;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, 'Profile updated successfully'));
});

/**
 * @route   PUT /api/user/password
 * @desc    Change authenticated user's password
 * @access  Protected
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'currentPassword and newPassword are required');
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, 'New password must be at least 8 characters');
  }

  // Fetch user with password
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save(); // pre-save hook will hash it

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Password changed successfully'));
});

module.exports = { getDashboardStats, updateProfile, changePassword };
