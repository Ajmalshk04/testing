const mongoose = require('mongoose');
const crypto = require('crypto');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  deviceInfo: {
    userAgent: String,
    ip: String,
    deviceId: String
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ expiresAt: 1 });
refreshTokenSchema.index({ isRevoked: 1 });

// Automatically delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate a new refresh token
refreshTokenSchema.statics.generateToken = function() {
  return crypto.randomBytes(64).toString('hex');
};

// Static method to create a new refresh token for a user
refreshTokenSchema.statics.createTokenForUser = async function(userId, deviceInfo = {}) {
  const token = this.generateToken();
  
  const refreshToken = new this({
    token,
    userId,
    deviceInfo
  });
  
  await refreshToken.save();
  return refreshToken;
};

// Static method to find valid token
refreshTokenSchema.statics.findValidToken = function(token) {
  return this.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: new Date() }
  }).populate('userId');
};

// Instance method to revoke token
refreshTokenSchema.methods.revoke = async function() {
  this.isRevoked = true;
  await this.save();
};

// Instance method to check if token is valid
refreshTokenSchema.methods.isValid = function() {
  return !this.isRevoked && this.expiresAt > new Date();
};

// Instance method to update last used
refreshTokenSchema.methods.updateLastUsed = async function() {
  this.lastUsed = new Date();
  await this.save();
};

// Static method to revoke all tokens for a user
refreshTokenSchema.statics.revokeAllForUser = async function(userId) {
  await this.updateMany(
    { userId, isRevoked: false },
    { isRevoked: true }
  );
};

// Static method to cleanup expired and revoked tokens
refreshTokenSchema.statics.cleanup = async function() {
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isRevoked: true }
    ]
  });
  return result.deletedCount;
};

// Pre-save middleware to ensure token is unique
refreshTokenSchema.pre('save', async function(next) {
  if (this.isNew && !this.token) {
    let tokenExists = true;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (tokenExists && attempts < maxAttempts) {
      this.token = this.constructor.generateToken();
      const existing = await this.constructor.findOne({ token: this.token });
      tokenExists = !!existing;
      attempts++;
    }
    
    if (tokenExists) {
      return next(new Error('Unable to generate unique refresh token'));
    }
  }
  next();
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);