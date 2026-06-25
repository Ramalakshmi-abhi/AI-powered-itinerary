const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const path = require('path');
const Itinerary = require('../models/Itinerary');
const UploadedFile = require('../models/UploadedFile');
const { deleteFile } = require('../services/storageService');

/**
 * Generate a signed JWT for a user ID
 * @param {string} id
 * @returns {string}
 */
const signToken = (id) => {
  const secret = process.env.JWT_SECRET || 'temp_secret_for_jwt_auth_12345';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({ fullName, email, password });
  const token = signToken(user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, { user, token }, 'Account created successfully'));
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { user, token }, 'Logged in successfully'));
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get currently authenticated user's profile
 * @access  Protected
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, 'Profile retrieved successfully'));
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client clears token)
 * @access  Protected
 */
const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Logged out successfully'));
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update authenticated user's profile
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
 * @route   DELETE /api/auth/account
 * @desc    Delete user account and all associated data (uploads, itineraries)
 * @access  Protected
 */
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Find all uploaded files for user and delete from storage
  const files = await UploadedFile.find({ userId });
  for (const file of files) {
    if (file.fileName) {
      try {
        await deleteFile(file.fileName, file.fileUrl);
      } catch (err) {
        console.error(`Failed to delete file ${file.fileName}:`, err.message);
      }
    }
  }

  // 2. Delete all files from DB
  await UploadedFile.deleteMany({ userId });

  // 3. Delete all itineraries for user
  await Itinerary.deleteMany({ userId });

  // 4. Delete user account
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Account and associated data deleted successfully'));
});

module.exports = { register, login, getProfile, logout, updateProfile, deleteAccount };
