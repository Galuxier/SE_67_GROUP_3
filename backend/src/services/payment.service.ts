import { Payment, PaymentDocument, PaymentStatus } from '../models/payment.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

class PaymentService extends BaseService<PaymentDocument> {
  constructor() {
    super(Payment);
  }

  /**
   * Create a new payment record
   * @param paymentData Payment data to create
   * @returns The created payment document
   */
  async createPayment(paymentData: Partial<PaymentDocument>): Promise<PaymentDocument> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Ensure required fields are present
      if (!paymentData.order_id) {
        throw new Error('Order ID is required');
      }

      if (!paymentData.user_id) {
        throw new Error('User ID is required');
      }

      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error('Valid payment amount is required');
      }

      if (!paymentData.payment_method) {
        throw new Error('Payment method is required');
      }

      // Set default values if not provided
      const payment = new Payment({
        ...paymentData,
        payment_status: paymentData.payment_status || PaymentStatus.Pending,
        create_at: new Date()
      });

      // If payment status is completed, set paid_at date
      if (payment.payment_status === PaymentStatus.Completed) {
        payment.paid_at = new Date();
      }

      await payment.save({ session });
      await session.commitTransaction();
      return payment;
    } catch (error) {
      await session.abortTransaction();
      console.error('Error creating payment:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Update payment status
   * @param paymentId Payment ID to update
   * @param status New payment status
   * @returns The updated payment document
   */
  async updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<PaymentDocument | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const payment = await Payment.findById(paymentId).session(session);
      
      if (!payment) {
        throw new Error(`Payment not found: ${paymentId}`);
      }
      
      payment.payment_status = status;
      
      // If status is changed to completed, set paid_at date
      if (status === PaymentStatus.Completed && !payment.paid_at) {
        payment.paid_at = new Date();
      }
      
      await payment.save({ session });
      await session.commitTransaction();
      
      return payment;
    } catch (error) {
      await session.abortTransaction();
      console.error('Error updating payment status:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get payments by order ID
   * @param orderId Order ID to filter by
   * @returns Array of payment documents
   */
  async getPaymentsByOrderId(orderId: string): Promise<PaymentDocument[]> {
    try {
      return await Payment.find({ order_id: new Types.ObjectId(orderId) });
    } catch (error) {
      console.error('Error fetching payments by order ID:', error);
      throw error;
    }
  }

  /**
   * Get payments by user ID
   * @param userId User ID to filter by
   * @returns Array of payment documents
   */
  async getPaymentsByUserId(userId: string): Promise<PaymentDocument[]> {
    try {
      return await Payment.find({ user_id: new Types.ObjectId(userId) })
        .populate('order_id');
    } catch (error) {
      console.error('Error fetching payments by user ID:', error);
      throw error;
    }
  }
}

export default new PaymentService();