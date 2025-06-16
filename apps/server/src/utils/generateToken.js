// apps/server/src/utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Determine if it's production environment
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    // Set 'secure' to true in production (requires HTTPS)
    // and false in development (for http://localhost)
    secure: isProduction,
    // For cross-site requests (frontend on Vercel, backend on Render),
    // sameSite MUST be 'None' in production.
    // In development, 'Strict' is fine as both are usually localhost.
    sameSite: isProduction ? 'None' : 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;