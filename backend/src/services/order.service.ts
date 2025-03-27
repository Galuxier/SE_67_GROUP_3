import { Order, OrderDocument, OrderType } from '../models/order.model';
import { Product, ProductDocument } from '../models/product.model';
import { Variant, VariantDocument } from '../models/variant.model';
import { Course, CourseDocument } from '../models/course.model';
import { Event, EventDocument } from '../models/event.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';

class OrderService extends BaseService<OrderDocument> {
  constructor() {
    super(Order);
  }

  async createOrder(orderData: Partial<OrderDocument>): Promise<OrderDocument> {
    console.log("order: ",orderData);
    const session = await Order.startSession();
    session.startTransaction();

    try {
      const order = new Order(orderData);
      
      
      for (const item of order.items) {
        switch (order.order_type) {
          case OrderType.Product:
            // เช็คว่ามี variant_id หรือไม่
            if (item.variant_id) {
              await this.updateProductStock(item.variant_id, item.quantity);
            }
            break;

          case OrderType.Course:
            await this.updateCourseStock(item.ref_id, item.quantity);
            break;

          case OrderType.Ticket:
            // await this.updateEventStock(item.ref_id, item.seat_zone_id, item.quantity);
            break;

          case OrderType.AdsPackage:
            // ไม่ต้องตัด stock สำหรับ AdsPackage
            break;

          default:
            throw new Error('Invalid order type');
        }
      }

      await order.save({ session });
      await session.commitTransaction();
      session.endSession();

      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // ตัด stock จาก Variant ของ Product
  private async updateProductStock(variantId: Types.ObjectId, quantity: number) {
    const variant = await Variant.findById(variantId);
    if (!variant) throw new Error('Variant not found');
    if (variant.stock < quantity) throw new Error('Not enough stock for variant');

    variant.stock -= quantity;
    await variant.save();
  }

  // ตัด stock จาก Course
  private async updateCourseStock(courseId: Types.ObjectId, quantity: number) {
    const course = await Course.findById(courseId);
    console.log(course);
    
    if (!course) throw new Error('Course not found');
    if (course.available_slot < quantity) throw new Error('Not enough stock for course');

    course.available_slot -= quantity;
    await course.save();
  }

  // ตัด stock จาก Event (seat_zone)
  // private async updateEventStock(eventId: Types.ObjectId, seatZoneId: Types.ObjectId, quantity: number) {
  //   const event = await Event.findById(eventId);
  //   if (!event) throw new Error('Event not found');

  //   const seatZone = event.seat_zones.id(seatZoneId);
  //   if (!seatZone) throw new Error('Seat zone not found');
  //   if (seatZone.available_seats < quantity) throw new Error('Not enough seats available');

  //   seatZone.available_seats -= quantity;
  //   await event.save();
  // }

  async getOrdersByShopId(shopId: string): Promise<OrderDocument[]> {
    try {
      // Find orders where at least one item in the shops array has the matching shop_id
      return await Order.find({ 
        "shops.shop_id": new Types.ObjectId(shopId) 
      }).populate('user_id', 'username first_name last_name');
    } catch (error) {
      console.error('Error fetching orders by shop ID:', error);
      throw error;
    }
  }

  async getOrdersByUserId(userId: string): Promise<OrderDocument[]> {
    try {
      // Find orders where at least one item in the shops array has the matching shop_id
      return await Order.find({ 
        "user_id": new Types.ObjectId(userId) 
      }).populate('user_id', 'username first_name last_name');
    } catch (error) {
      console.error('Error fetching orders by shop ID:', error);
      throw error;
    }
  }
}

export default new OrderService();
