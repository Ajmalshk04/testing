const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  bulkUpdateUsers,
  bulkDeleteUsers,
  exportUsers
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize('admin'), getUsers);
router.get('/stats', authorize('admin'), getUserStats);
router.get('/export', authorize('admin'), exportUsers);
router.patch('/bulk', authorize('admin'), bulkUpdateUsers);
router.delete('/bulk', authorize('admin'), bulkDeleteUsers);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;