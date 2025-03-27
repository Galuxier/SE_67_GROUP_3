// src/routes/cart.routes.ts
import express from 'express';
import {
  addItemToCartController,
  getCartByUserIdController,
  removeItemFromCartController,
  updateItemQuantityController
} from '../controllers/cart.controller';

const router = express.Router();

// Add item to cart
router.post('/cart/add', addItemToCartController);

// Get cart by user ID
router.get('/cart/user/:user_id', getCartByUserIdController);

// Remove item from cart
router.post('/cart/remove', removeItemFromCartController);

// Update item quantity
router.post('/cart/update-quantity', updateItemQuantityController);

export default router;