const express = require('express');
const {
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
} = require('../controllers/authController');
const { authenticate, authRateLimit } = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateUpdateProfile
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Public routes with rate limiting
router.post('/register', authRateLimit(5), validateRegister, register);
router.post('/login', authRateLimit(5), validateLogin, login);
router.post('/refresh', authRateLimit(10), refreshToken);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/logout', logout);
router.post('/logout-all', logoutAll);
router.get('/me', getMe);
router.put('/profile', validateUpdateProfile, updateProfile);
router.put('/change-password', validateChangePassword, changePassword);
router.get('/sessions', getSessions);
router.delete('/sessions/:sessionId', revokeSession);

module.exports = router;