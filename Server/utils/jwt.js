const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../models');

/**
 * Generate JWT access token
 * @param {Object} payload - The payload to include in the token
 * @returns {String} - The signed JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    { 
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
      issuer: 'auth-server',
      audience: 'auth-client'
    }
  );
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - The payload to include in the token
 * @returns {String} - The signed JWT token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { 
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
      issuer: 'auth-server',
      audience: 'auth-client'
    }
  );
};

/**
 * Verify JWT access token
 * @param {String} token - The token to verify
 * @returns {Object} - The decoded payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      issuer: 'auth-server',
      audience: 'auth-client'
    });
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

/**
 * Verify JWT refresh token
 * @param {String} token - The token to verify
 * @returns {Object} - The decoded payload
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'auth-server',
      audience: 'auth-client'
    });
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} user - User object
 * @param {Object} deviceInfo - Device information
 * @returns {Object} - Object containing access and refresh tokens
 */
const generateTokenPair = async (user, deviceInfo = {}) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };

  // Generate access token
  const accessToken = generateAccessToken(payload);

  // Create refresh token in database
  const refreshTokenDoc = await RefreshToken.createTokenForUser(user._id, deviceInfo);

  // Generate JWT refresh token
  const refreshToken = generateRefreshToken({
    tokenId: refreshTokenDoc._id,
    userId: user._id
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'
  };
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {String} token - The token to decode
 * @returns {Object} - The decoded payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Get token expiration time
 * @param {String} token - The token to check
 * @returns {Date} - Expiration date
 */
const getTokenExpiration = (token) => {
  const decoded = jwt.decode(token);
  return new Date(decoded.exp * 1000);
};

/**
 * Check if token is expired
 * @param {String} token - The token to check
 * @returns {Boolean} - True if expired
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  decodeToken,
  getTokenExpiration,
  isTokenExpired
};