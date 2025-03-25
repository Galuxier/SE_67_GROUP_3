import express from 'express';
import {
  createCartController,
  getCartsController,
  getCartByIdController,
  updateCartController,
  deleteCartController,
} from '../controllers/cart.controller';

const router = express.Router();

router.post('/carts', createCartController);
router.get('/carts', getCartsController);
router.get('/cart/:id', getCartByIdController);
router.put('/cart/:id', updateCartController);
router.delete('/cart/:id', deleteCartController);

export default router;
