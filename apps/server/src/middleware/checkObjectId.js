// apps/backend/middleware/checkObjectId.js
import mongoose from 'mongoose'; // Make sure mongoose is installed and imported

const checkObjectId = (req, res, next) => {
  // Check if req.params.id is a valid MongoDB ObjectId
  // mongoose.Types.ObjectId.isValid() is the method to use
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    // If it's not a valid ObjectId format, send a 404 Not Found response
    // Or you can use 400 Bad Request if you prefer
    res.status(404);
    // Throw an error that will be caught by your asyncHandler and errorHandler middleware
    throw new Error(`Resource not found - Invalid ID: ${req.params.id}`);
  }
  next(); // If valid, proceed to the next middleware/controller
};

export default checkObjectId;