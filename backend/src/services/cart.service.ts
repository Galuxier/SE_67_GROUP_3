// src/services/cart.service.ts
import { Cart, CartDocument } from '../models/cart.model';
import { BaseService } from './base.service';
import { Product } from '../models/product.model';
import { Variant } from '../models/variant.model';
import { Types } from 'mongoose';

class CartService extends BaseService<CartDocument> {
  constructor() {
    super(Cart);
  }

  async getCartByUserId(userId: string): Promise<CartDocument | null> {
    try {
      return await Cart.findOne({ user_id: new Types.ObjectId(userId) })
        .populate({
          path: 'shops.items.product_id',
          select: 'product_name product_image_urls base_price'
        })
        .populate({
          path: 'shops.items.variant_id',
          select: 'price stock attributes variant_image_url'
        });
    } catch (error) {
      console.error('Error getting cart by user ID:', error);
      throw error;
    }
  }

  async addToCart(
    userId: string,
    shopId: string,
    productId: string,
    quantity: number,
    variantId?: string
  ): Promise<CartDocument> {
    try {
      // Find user's cart or create new one if it doesn't exist
      let cart = await Cart.findOne({ user_id: userId });

      if (!cart) {
        // Create new cart
        cart = new Cart({
          user_id: new Types.ObjectId(userId),
          shops: [],
          total_price: 0
        });
      }

      // Find shop in the cart
      let shop = cart.shops.find(shop => shop.shop_id.toString() === shopId);

      if (!shop) {
        // Shop doesn't exist in cart, create it
        shop = {
          shop_id: new Types.ObjectId(shopId),
          items: []
        };
        cart.shops.push(shop);
      }

      // Find item in the shop (matching both product_id and variant_id if provided)
      const itemIndex = shop.items.findIndex(item => 
        item.product_id.toString() === productId && 
        (variantId ? item.variant_id?.toString() === variantId : !item.variant_id)
      );

      if (itemIndex !== -1) {
        // Item exists, update quantity
        shop.items[itemIndex].quantity += quantity;
      } else {
        // Item doesn't exist, add new item
        shop.items.push({
          product_id: new Types.ObjectId(productId),
          variant_id: variantId ? new Types.ObjectId(variantId) : undefined,
          quantity
        });
      }

      // Update total price
      await this.updateTotalPrice(cart);

      // Save cart
      await cart.save();

      // Return populated cart
      return await this.getCartByUserId(userId) as CartDocument;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async removeFromCart(
    userId: string,
    shopId: string,
    variantId: string
  ): Promise<CartDocument | null> {
    try {
      const cart = await Cart.findOne({ user_id: userId });
      if (!cart) return null;

      // Find shop index
      const shopIndex = cart.shops.findIndex(shop => shop.shop_id.toString() === shopId);
      if (shopIndex === -1) return cart;

      // Find item index
      const itemIndex = cart.shops[shopIndex].items.findIndex(
        item => item.variant_id?.toString() === variantId
      );
      if (itemIndex === -1) return cart;

      // Remove item
      cart.shops[shopIndex].items.splice(itemIndex, 1);

      // If shop has no items, remove shop
      if (cart.shops[shopIndex].items.length === 0) {
        cart.shops.splice(shopIndex, 1);
      }

      // Update total price
      await this.updateTotalPrice(cart);

      // Save cart
      await cart.save();

      // Return populated cart
      return await this.getCartByUserId(userId) as CartDocument;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async updateItemQuantity(
    userId: string,
    shopId: string,
    variantId: string,
    quantity: number
  ): Promise<CartDocument | null> {
    try {
      if (quantity <= 0) {
        // If quantity is zero or negative, remove the item
        return this.removeFromCart(userId, shopId, variantId);
      }

      const cart = await Cart.findOne({ user_id: userId });
      if (!cart) return null;

      // Find shop
      const shop = cart.shops.find(shop => shop.shop_id.toString() === shopId);
      if (!shop) return cart;

      // Find item
      const item = shop.items.find(item => item.variant_id?.toString() === variantId);
      if (!item) return cart;

      // Update quantity
      item.quantity = quantity;

      // Update total price
      await this.updateTotalPrice(cart);

      // Save cart
      await cart.save();

      // Return populated cart
      return await this.getCartByUserId(userId) as CartDocument;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  }

  async updateTotalPrice(cart: CartDocument): Promise<void> {
    let totalPrice = 0;

    for (const shop of cart.shops) {
      for (const item of shop.items) {
        let price = 0;

        if (item.variant_id) {
          // Get price from variant
          const variant = await Variant.findById(item.variant_id);
          price = variant ? variant.price : 0;
        } else {
          // Get base price from product
          const product = await Product.findById(item.product_id);
          price = product ? product.base_price : 0;
        }

        totalPrice += price * item.quantity;
      }
    }

    cart.total_price = totalPrice;
  }
}

export default new CartService();