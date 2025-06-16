// apps/backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Import the crypto module for token generation

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    // New fields for password reset
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving (only if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to generate a password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token using crypto
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash the token and set to passwordResetToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expiration (e.g., 1 hour from now)
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

  return resetToken; // Return the unhashed token to be sent to the user's email
};


const User = mongoose.model('User', userSchema);

export default User;