import { Cart, CartDocument } from '../models/cart.model';

export const createCart = async (cartData: CartDocument) => {
  return await Cart.create(cartData);
};

export const getCarts = async () => {
  return await Cart.find().populate('user products.product');
};

export const getCartById = async (cartId: string) => {
  return await Cart.findById(cartId).populate('user products.product');
};

export const updateCart = async (cartId: string, updateData: Partial<CartDocument>) => {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error('Cart not found');
  Object.assign(cart, updateData);
  cart.updated_at = new Date();
  return await cart.save();
};

export const deleteCart = async (cartId: string) => {
  return await Cart.findByIdAndDelete(cartId);
};
