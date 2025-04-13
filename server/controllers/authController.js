const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const config = require('../config/config');

// @desc    Authenticate guard
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validate request
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username and password'
    });
  }

  // Check for guard
  const guard = await User.findByUsername(username);
  
  if (!guard) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isMatch = await User.comparePassword(password, guard.password);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Create token
  const token = User.getSignedJwtToken(guard);

  res.status(200).json({
    success: true,
    token,
    user: {
      username: guard.username,
      role: guard.role
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    username: req.user.username,
    role: req.user.role
  };

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  login,
  getMe
};