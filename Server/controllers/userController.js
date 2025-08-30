const { User } = require('../models');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all users (Admin only) with advanced filtering
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    search = '',
    role,
    isActive,
    isEmailVerified,
    dateFrom,
    dateTo,
    lastLoginFrom,
    lastLoginTo
  } = req.query;

  // Build query object
  let query = {};

  // Global search across name and email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Role filter
  if (role && role !== 'all') {
    if (Array.isArray(role)) {
      query.role = { $in: role };
    } else {
      query.role = role;
    }
  }

  // Active status filter
  if (isActive !== undefined && isActive !== '') {
    query.isActive = isActive === 'true';
  }

  // Email verification filter
  if (isEmailVerified !== undefined && isEmailVerified !== '') {
    query.isEmailVerified = isEmailVerified === 'true';
  }

  // Created date range filter
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) {
      query.createdAt.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      query.createdAt.$lte = new Date(dateTo);
    }
  }

  // Last login date range filter
  if (lastLoginFrom || lastLoginTo) {
    query.lastLogin = {};
    if (lastLoginFrom) {
      query.lastLogin.$gte = new Date(lastLoginFrom);
    }
    if (lastLoginTo) {
      query.lastLogin.$lte = new Date(lastLoginTo);
    }
  }

  // Execute query with pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(query)
    .sort(sort)
    .limit(limitNum)
    .skip(skip);

  const total = await User.countDocuments(query);

  // Get filter statistics for faceted filters
  const roleStats = await User.aggregate([
    { $match: search ? query.$or ? { $or: query.$or } : {} : {} },
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  const statusStats = await User.aggregate([
    { $match: search ? query.$or ? { $or: query.$or } : {} : {} },
    { $group: { _id: '$isActive', count: { $sum: 1 } } }
  ]);

  const emailVerificationStats = await User.aggregate([
    { $match: search ? query.$or ? { $or: query.$or } : {} : {} },
    { $group: { _id: '$isEmailVerified', count: { $sum: 1 } } }
  ]);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      },
      filters: {
        roles: roleStats.map(stat => ({ 
          value: stat._id, 
          count: stat.count 
        })),
        status: statusStats.map(stat => ({ 
          value: stat._id ? 'active' : 'inactive', 
          count: stat.count 
        })),
        emailVerification: emailVerificationStats.map(stat => ({ 
          value: stat._id ? 'verified' : 'unverified', 
          count: stat.count 
        }))
      }
    }
  });
});

/**
 * @desc    Get user by ID (Admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: {
      user
    }
  });
});

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findByEmail(email);
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      });
    }
  }

  // Update fields
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user
    }
  });
});

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

/**
 * @desc    Get user statistics (Admin only)
 * @route   GET /api/users/stats
 * @access  Private/Admin
 */
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const adminUsers = await User.countDocuments({ role: 'admin' });
  
  // Users registered in the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  // Users who logged in the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentlyActiveUsers = await User.countDocuments({
    lastLogin: { $gte: sevenDaysAgo }
  });

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      adminUsers,
      regularUsers: totalUsers - adminUsers,
      newUsers,
      recentlyActiveUsers
    }
  });
});

/**
 * @desc    Bulk update users (Admin only)
 * @route   PATCH /api/users/bulk
 * @access  Private/Admin
 */
const bulkUpdateUsers = asyncHandler(async (req, res) => {
  const { userIds, updates } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'User IDs array is required'
    });
  }

  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Updates object is required'
    });
  }

  // Validate updates (only allow certain fields)
  const allowedUpdates = ['isActive', 'role'];
  const updateFields = {};
  
  Object.keys(updates).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updateFields[key] = updates[key];
    }
  });

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid update fields provided'
    });
  }

  // Prevent admin from deactivating themselves
  if (updateFields.isActive === false && userIds.includes(req.user._id.toString())) {
    return res.status(400).json({
      success: false,
      message: 'You cannot deactivate your own account'
    });
  }

  const result = await User.updateMany(
    { _id: { $in: userIds } },
    { $set: updateFields },
    { runValidators: true }
  );

  res.json({
    success: true,
    message: `Updated ${result.modifiedCount} users successfully`,
    data: {
      matched: result.matchedCount,
      modified: result.modifiedCount
    }
  });
});

/**
 * @desc    Bulk delete users (Admin only)
 * @route   DELETE /api/users/bulk
 * @access  Private/Admin
 */
const bulkDeleteUsers = asyncHandler(async (req, res) => {
  const { userIds } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'User IDs array is required'
    });
  }

  // Prevent admin from deleting themselves
  if (userIds.includes(req.user._id.toString())) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  const result = await User.deleteMany({
    _id: { $in: userIds }
  });

  res.json({
    success: true,
    message: `Deleted ${result.deletedCount} users successfully`,
    data: {
      deleted: result.deletedCount
    }
  });
});

/**
 * @desc    Export users data (Admin only)
 * @route   GET /api/users/export
 * @access  Private/Admin
 */
const exportUsers = asyncHandler(async (req, res) => {
  const { format = 'json', ...filters } = req.query;

  // Build query using same logic as getUsers
  let query = {};
  
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters.role && filters.role !== 'all') {
    query.role = filters.role;
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive === 'true';
  }

  const users = await User.find(query).select('-password -emailVerificationToken -passwordResetToken');

  if (format === 'csv') {
    // Convert to CSV format
    const csvHeader = 'ID,Name,Email,Role,Active,Email Verified,Created At,Last Login\n';
    const csvData = users.map(user => 
      `${user._id},"${user.name}",${user.email},${user.role},${user.isActive},${user.isEmailVerified},${user.createdAt.toISOString()},${user.lastLogin ? user.lastLogin.toISOString() : ''}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    return res.send(csvHeader + csvData);
  }

  // Default JSON format
  res.json({
    success: true,
    data: {
      users,
      exportedAt: new Date().toISOString(),
      count: users.length
    }
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  bulkUpdateUsers,
  bulkDeleteUsers,
  exportUsers
};