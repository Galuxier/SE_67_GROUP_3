import { Order, OrderDocument, OrderType, OrderStatus } from '../models/order.model';
import { Product } from '../models/product.model';
import { Variant } from '../models/variant.model';
import { Course } from '../models/course.model';
import { Event } from '../models/event.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';
import mongoose from 'mongoose'; // Add this import
import VariantService from './variant.service';

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

  /**
   * Update an order's status and handle stock adjustments accordingly
   * @param orderId Order ID to update
   * @param newStatus New status for the order
   * @returns Updated order document
   */
  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<OrderDocument | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      
      if (!order) {
        throw new Error(`Order not found: ${orderId}`);
      }
      
      const oldStatus = order.status;
      
      // No stock changes needed if status doesn't change
      if (oldStatus === newStatus) {
        await session.commitTransaction();
        return order;
      }
      
      // Skip stock adjustments if this is a new order that hasn't processed stock yet
      const isNewOrder = oldStatus === OrderStatus.Pending && 
                         (newStatus === OrderStatus.Completed);
      
      // Only adjust stock for canceled/failed orders that were previously not canceled/failed
      const needsStockRollback = (newStatus === OrderStatus.Cancelled || newStatus === OrderStatus.Failed) &&
                               (oldStatus !== OrderStatus.Cancelled && oldStatus !== OrderStatus.Failed);
      
      if (needsStockRollback) {
        // Prepare variant updates for product orders (positive quantity for stock return)
        const variantUpdates = [];
        
        // Process items based on order type
        for (const item of order.items) {
          switch (order.order_type) {
            case OrderType.Product:
              if (item.variant_id) {
                // Add to batch update list (positive quantity for stock return)
                variantUpdates.push({
                  variantId: item.variant_id.toString(),
                  quantityChange: item.quantity 
                });
              }
              break;

            case OrderType.Course:
              await this.updateCourseStock(item.ref_id, item.quantity, session);
              break;

            case OrderType.Ticket:
              break;

            default:
              break;
          }
        }

        // Batch update all product variants if needed
        if (variantUpdates.length > 0) {
          await VariantService.updateMultipleStocks(variantUpdates, session);
        }
      }
      
      // Update order status
      order.status = newStatus;
      await order.save({ session });
      
      // Commit the transaction
      await session.commitTransaction();
      return order;
    } catch (error) {
      // If any operation fails, abort the transaction
      await session.abortTransaction();
      console.error('Order status update failed:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Helper method to update course available slots
  private async updateCourseStock(
    courseId: Types.ObjectId, 
    quantityChange: number, 
    session: mongoose.ClientSession | null = null
  ) {
    const course = await Course.findById(courseId).session(session);
    if (!course) throw new Error('Course not found');
    
    const newAvailableSlot = (course.available_slot || 0) + quantityChange;
    
    if (newAvailableSlot < 0) {
      throw new Error(`Not enough available slots for course ${courseId}`);
    }
    
    course.available_slot = newAvailableSlot;
    await course.save({ session });
    return course;
  }


  // ตัด stock จาก Variant ของ Product
  private async updateProductStock(variantId: Types.ObjectId, quantity: number) {
    const variant = await Variant.findById(variantId);
    if (!variant) throw new Error('Variant not found');
    if (variant.stock < quantity) throw new Error('Not enough stock for variant');

    variant.stock -= quantity;
    await variant.save();
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
