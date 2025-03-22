import express from 'express';
import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getProductsByShopIdController
} from '../controllers/product.controller';

const router = express.Router();

// Existing routes
router.post('/products', createProductController);
router.get('/products', getProductsController);
router.get('/product/:id', getProductByIdController);
router.put('/product/:id', updateProductController);
router.delete('/product/:id', deleteProductController);

// New route to get products by shop_id
router.get('/shops/:shopId/products', getProductsByShopIdController);

export default router;