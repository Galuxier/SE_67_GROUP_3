import { Request, Response } from 'express';
import CartService from '../services/cart.service';
import { Types } from 'mongoose';

export const addItemToCartController = async (req: Request, res: Response) => {
  try {
    const { user_id, shop_id, product_id, variant_id, quantity } = req.body;

    // Validate required fields
    if (!user_id || !shop_id || !product_id || !quantity) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, shop_id, product_id, and quantity are required'
      });
      return ;
    }

    // Convert to number if needed
    const quantityNum = typeof quantity === 'string' ? parseInt(quantity) : quantity;

    // Add to cart using service
    const updatedCart = await CartService.addToCart(
      user_id,
      shop_id,
      product_id,
      quantityNum,
      variant_id
    );

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: updatedCart
    });
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: err
    });
  }
};

export const getCartByUserIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return ;
    }

    // Get cart using service
    const cart = await CartService.getCartByUserId(userId);

    res.status(200).json({
      success: true,
      data: cart || { user_id: userId, shops: [], total_price: 0 }
    });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: err
    });
  }
};

export const removeItemFromCartController = async (req: Request, res: Response) => {
  try {
    const { user_id, shop_id, variant_id } = req.body;

    if (!user_id || !shop_id || !variant_id) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, shop_id, and variant_id are required'
      });
      return ;
    }

    const updatedCart = await CartService.removeFromCart(user_id, shop_id, variant_id);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: updatedCart
    });
  } catch (err) {
    console.error('Error removing item from cart:', err);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: err
    });
  }
};

export const updateItemQuantityController = async (req: Request, res: Response) => {
  try {
    const { user_id, shop_id, variant_id, quantity } = req.body;

    if (!user_id || !shop_id || !variant_id || quantity === undefined) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, shop_id, variant_id, and quantity are required'
      });
      return ;
    }

    const updatedCart = await CartService.updateItemQuantity(user_id, shop_id, variant_id, quantity);

    res.status(200).json({
      success: true,
      message: 'Cart item quantity updated successfully',
      data: updatedCart
    });
  } catch (err) {
    console.error('Error updating cart item quantity:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item quantity',
      error: err
    });
  }
};