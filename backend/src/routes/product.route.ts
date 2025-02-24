import express from 'express';
import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from '../controllers/product.controller';

const router = express.Router();

router.post('/products', createProductController);
router.get('/products', getProductsController);
router.get('/product/:id', getProductByIdController);
router.put('/product/:id', updateProductController);
router.delete('/product/:id', deleteProductController);

export default router;
