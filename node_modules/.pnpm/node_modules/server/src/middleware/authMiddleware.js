// apps/server/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'; // npm install express-async-handler
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // READ JWT FROM THE 'jwt' COOKIE
  token = req.cookies.jwt; // <--- THIS IS THE CORRECT WAY TO GET THE TOKEN FROM THE COOKIE

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    // If no token is found in the cookie
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };