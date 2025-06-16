// apps/backend/routes/productRoutes.js
import express from 'express';
const router = express.Router();
import {
  getProducts,
  getTopProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview, 
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.get('/top', getTopProducts);

router.route('/').get(getProducts).post(protect, admin, createProduct); // Added createProduct route

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

// NEW ROUTE FOR PRODUCT REVIEWS
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview); 


export default router;