import express from 'express';
import {
  createVariantController,
  createManyVariantsController,
  getVariantsController,
  getVariantByIdController,
  getVariantsByProductIdController,
  updateVariantController,
  updateVariantStockController,
  deleteVariantController,
  deleteVariantsByProductIdController
} from '../controllers/variant.controller';
import { variantImageUpload } from '../middlewares/uploads/product.upload';

const router = express.Router();

// Create a single variant
router.post('/variants', variantImageUpload, createVariantController);

// Create multiple variants at once
router.post('/variants/batch', createManyVariantsController);

// Get all variants
router.get('/variants', getVariantsController);

// Get a specific variant by ID
router.get('/variant/:id', getVariantByIdController);

// Get all variants for a specific product
router.get('/product/:productId/variants', getVariantsByProductIdController);

// Update a variant
router.put('/variant/:id', variantImageUpload, updateVariantController);

// Update variant stock
router.patch('/variant/:id/stock', updateVariantStockController);

// Delete a variant
router.delete('/variant/:id', deleteVariantController);

// Delete all variants for a product
router.delete('/product/:productId/variants', deleteVariantsByProductIdController);

export default router;