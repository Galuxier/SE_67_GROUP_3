import express from 'express';
import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getProductsByShopIdController
} from '../controllers/product.controller';
import { productImageUpload } from '../middlewares/uploads/product.upload';

const router = express.Router();

// Create a new product
router.post('/products', productImageUpload, createProductController);

// Get all products with optional filtering
router.get('/products', getProductsController);

// Get a specific product by ID (with its variants)
router.get('/product/:id', getProductByIdController);

// Update a product
router.put('/product/:id', productImageUpload, updateProductController);

// Delete a product and all its variants
router.delete('/product/:id', deleteProductController);

// Get all products for a specific shop
router.get('/shops/:shopId/products', getProductsByShopIdController);

export default router;