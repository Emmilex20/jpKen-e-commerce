// apps/backend/routes/userRoutes.js
import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  forgotPassword, 
  resetPassword,  
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/auth', authUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);

// New public routes for password reset
router.post('/forgotpassword', forgotPassword); 
router.put('/resetpassword/:resettoken', resetPassword); 

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin routes
router.route('/').get(protect, admin, getUsers);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;