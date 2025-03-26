import { Request, Response } from 'express';
import CartService from '../services/cart.service';

export const addToCartController = async (req: Request, res: Response) => {
  const { user_id, shop_id, product_id, variant_id, quantity } = req.body;

  try {
    const cart = await CartService.addToCart(user_id, shop_id, product_id, variant_id, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getCartsController = async (req: Request, res: Response) => {
  try {
    const carts = await CartService.getAll();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching carts', error: err });
  }
};

export const getCartByIdController = async (req: Request, res: Response) => {
  try {
    const cart = await CartService.getById(req.params.id);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err });
  }
};

export const updateCartController = async (req: Request, res: Response) => {
  try {
    const updatedCart = await CartService.update(req.params.id, req.body);
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart', error: err });
  }
};

export const deleteCartController = async (req: Request, res: Response) => {
  try {
    const deletedCart = await CartService.delete(req.params.id);
    res.status(200).json(deletedCart);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting cart', error: err });
  }
};