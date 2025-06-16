// apps/server/src/controllers/userController.js
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Generate token and set it as an HTTP-only cookie
    generateToken(res, user._id); // This function will set the cookie

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // The token is now in an HTTP-only cookie, so no need to send it in the JSON response body
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    // Generate token and set it as an HTTP-only cookie
    generateToken(res, user._id); // This function will set the cookie

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // The token is now in an HTTP-only cookie, so no need to send it in the JSON response body
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { // Clear the 'jwt' cookie
    httpOnly: true,
    expires: new Date(0), // Set expiration to a past date
  });
  res.status(200).json({ message: 'Logged out successfully' });
});


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated from the protect middleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password; // This will hash via pre-save hook in userModel
    }

    const updatedUser = await user.save();

    // Re-generate token for updated profile if necessary (e.g., if token payload changes)
    // generateToken(res, updatedUser._id); // Re-set the cookie if token payload needs update

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      // No token sent in JSON response body if using HTTP-only cookie
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password'); // Exclude password
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Request Password Reset (Send reset email)
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found. No account associated with that email.');
    // IMPORTANT: For security, you might want a more generic message like
    // 'If an account with that email exists, a password reset link has been sent.'
    // This prevents revealing whether an email is registered or not.
  }

  // Get reset token using the method from the User model
  const resetToken = user.getResetPasswordToken();

  // Save the user with the new token and expiration
  await user.save({ validateBeforeSave: false }); // Disable validation to skip password hashing on token update

  // Create reset URL for the email
  // IMPORTANT: Replace 'http://localhost:3000' with your actual frontend domain in production!
  const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;

  // Consider replacing req.protocol and req.get('host') with your actual CLIENT_URL from .env
  // For example:
  // const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`;
  // You would need to add CLIENT_URL=http://localhost:3000 (or your domain) to your backend's .env file

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password:</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    <p>This link is valid for 1 hour.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'ProShop Password Reset Request',
      message,
    });

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    user.passwordResetToken = undefined; // Clear token if email sending fails
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false }); // Save user without token

    console.error('Error sending password reset email:', error); // Log the actual error
    res.status(500);
    throw new Error('Email could not be sent. Please try again later.');
  }
});

// @desc    Reset User Password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token from URL parameter
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  // Find user by hashed token and check for expiration
  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() }, // Token must not be expired
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token.');
  }

  // Set new password
  user.password = req.body.password;
  user.passwordResetToken = undefined; // Clear the token fields
  user.passwordResetExpires = undefined;

  await user.save(); // The pre-save middleware in User model will hash the new password

  // Re-generate token and send new JWT to log user in immediately
  generateToken(res, user._id); // This will set the http-only cookie

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    message: 'Password reset successful. You are now logged in.',
  });
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : Boolean(req.body.isAdmin); // Ensure boolean

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser, // <--- Added logoutUser to the export list
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
};