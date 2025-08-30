const { User, RefreshToken } = require('../models');
const { generateTokenPair, verifyRefreshToken } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  // Get device info
  const deviceInfo = {
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress
  };

  // Generate tokens
  const tokens = await generateTokenPair(user, deviceInfo);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.toJSON(),
      ...tokens
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findByEmail(email).select('+password');
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account has been deactivated'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Get device info
  const deviceInfo = {
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress
  };

  // Generate tokens
  const tokens = await generateTokenPair(user, deviceInfo);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      ...tokens
    }
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    // Verify JWT refresh token
    const decoded = verifyRefreshToken(token);

    // Find refresh token in database
    const refreshTokenDoc = await RefreshToken.findValidToken(token);
    
    if (!refreshTokenDoc) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Check if user still exists and is active
    if (!refreshTokenDoc.userId || !refreshTokenDoc.userId.isActive) {
      await refreshTokenDoc.revoke();
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated'
      });
    }

    // Update last used
    await refreshTokenDoc.updateLastUsed();

    // Get device info
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress
    };

    // Generate new token pair
    const tokens = await generateTokenPair(refreshTokenDoc.userId, deviceInfo);

    // Optionally revoke old refresh token (token rotation)
    await refreshTokenDoc.revoke();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    });

  } catch (error) {
    // If JWT verification fails, try to find and revoke the token
    const refreshTokenDoc = await RefreshToken.findOne({ token });
    if (refreshTokenDoc) {
      await refreshTokenDoc.revoke();
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (token) {
    // Find and revoke the specific refresh token
    const refreshTokenDoc = await RefreshToken.findOne({ token });
    if (refreshTokenDoc) {
      await refreshTokenDoc.revoke();
    }
  }

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @desc    Logout from all devices
 * @route   POST /api/auth/logout-all
 * @access  Private
 */
const logoutAll = asyncHandler(async (req, res) => {
  // Revoke all refresh tokens for the user
  await RefreshToken.revokeAllForUser(req.user._id);

  res.json({
    success: true,
    message: 'Logged out from all devices successfully'
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toJSON()
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email && email !== user.email) {
    // Check if email is already taken
    const existingUser = await User.findByEmail(email);
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      });
    }
    user.email = email;
    user.isEmailVerified = false; // Reset email verification if email changed
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.toJSON()
    }
  });
});

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Revoke all refresh tokens to force re-login on all devices
  await RefreshToken.revokeAllForUser(user._id);

  res.json({
    success: true,
    message: 'Password changed successfully. Please login again on all devices.'
  });
});

/**
 * @desc    Get user's active sessions
 * @route   GET /api/auth/sessions
 * @access  Private
 */
const getSessions = asyncHandler(async (req, res) => {
  const sessions = await RefreshToken.find({
    userId: req.user._id,
    isRevoked: false,
    expiresAt: { $gt: new Date() }
  }).sort({ lastUsed: -1 });

  const formattedSessions = sessions.map(session => ({
    id: session._id,
    deviceInfo: session.deviceInfo,
    lastUsed: session.lastUsed,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt
  }));

  res.json({
    success: true,
    data: {
      sessions: formattedSessions
    }
  });
});

/**
 * @desc    Revoke a specific session
 * @route   DELETE /api/auth/sessions/:sessionId
 * @access  Private
 */
const revokeSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await RefreshToken.findOne({
    _id: sessionId,
    userId: req.user._id
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  await session.revoke();

  res.json({
    success: true,
    message: 'Session revoked successfully'
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
  updateProfile,
  changePassword,
  getSessions,
  revokeSession
};