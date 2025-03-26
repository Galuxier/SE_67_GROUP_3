import { Cart, CartDocument } from '../models/cart.model';
import { BaseService } from './base.service';
import { Product } from '../models/product.model';
import { Variant } from '../models/variant.model';
import { Types } from 'mongoose';

class CartService extends BaseService<CartDocument> {
  constructor() {
    super(Cart);
  }

  async addToCart(userId: string, shopId: string, productId: string, quantity: number, variantId?: string) {
    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      // ถ้ายังไม่มี cart → สร้างใหม่
      cart = new Cart({
        user_id: userId,
        shops: [],
        total_price: 0
      });
    }

    // ค้นหา shop ในตะกร้า
    let shop = cart.shops.find(shop => shop.shop_id.toString() === shopId);

    if (!shop) {
      // ถ้ายังไม่มี shop → สร้างใหม่
      shop = {
        shop_id:  new Types.ObjectId(shopId),
        items: []
      };
      cart.shops.push(shop);
    }

    // ค้นหา product ใน shop
    let item = shop.items.find(item =>
      item.product_id.toString() === productId &&
      item.variant_id?.toString() === variantId
    );

    if (item) {
      // ถ้ามีสินค้าอยู่แล้ว → เพิ่มจำนวนสินค้า
      item.quantity += quantity;
    } else {
      // ถ้ายังไม่มีสินค้า → เพิ่มใหม่
      shop.items.push({
        product_id: new Types.ObjectId(productId),
        variant_id: new Types.ObjectId(variantId),
        quantity
      });
    }

    // อัปเดตราคาใหม่
    await this.updateTotalPrice(cart);

    // บันทึกลงฐานข้อมูล
    await cart.save();

    // ดึงข้อมูล product และ variant เพื่อ res กลับไปให้ frontend อัปเดต
    const populatedCart = await Cart.findById(cart._id)
      .populate('shops.items.product_id') // ดึงข้อมูล product ทั้งหมด
      .populate('shops.items.variant_id'); // ดึงข้อมูล variant ทั้งหมด

    return populatedCart;
  }

  async updateTotalPrice(cart: CartDocument) {
    let totalPrice = 0;

    for (const shop of cart.shops) {
      for (const item of shop.items) {
        const product = await Product.findById(item.product_id);
        const variant = item.variant_id ? await Variant.findById(item.variant_id) : null;

        if (product) {
          const price = variant ? variant.price : product.base_price;
          totalPrice += price * item.quantity;
        } 
      }
    }

    cart.total_price = totalPrice;
  }
}

export default new CartService();
