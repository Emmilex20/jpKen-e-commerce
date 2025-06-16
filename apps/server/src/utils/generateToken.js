import jwt from 'jsonwebtoken';

// This function now only generates and returns the token string
const generateToken = (userId) => { // Removed `res` parameter
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  return token; // Return the token string
};

export default generateToken;