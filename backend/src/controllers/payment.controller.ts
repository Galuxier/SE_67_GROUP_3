import { Request, Response } from 'express';
import PaymentService from '../services/payment.service';
import { PaymentStatus } from '../models/payment.model';
import { Types } from 'mongoose';

export const createPaymentController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const { order_id, user_id, amount, payment_method, payment_status } = req.body;

    if (!order_id || !user_id || !amount || !payment_method) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: order_id, user_id, amount, and payment_method are required'
      });
      return;
    }

    // Create payment data object without explicitly creating new ObjectIds
    const paymentData = {
      order_id, // Mongoose will convert these to ObjectIds
      user_id,  // when they are saved to the database
      amount: parseFloat(amount),
      payment_method,
      payment_status: payment_status || PaymentStatus.Pending
    };

    const newPayment = await PaymentService.createPayment(paymentData);

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: newPayment
    });
  } catch (err) {
    console.error('Error creating payment:', err);
    res.status(400).json({
      success: false,
      message: 'Error creating payment',
      error: err
    });
  }
};

export const getPaymentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_id, user_id, status } = req.query;

    // If order_id is provided, get payments for that order
    if (order_id) {
      const payments = await PaymentService.getPaymentsByOrderId(order_id as string);
      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
      return;
    }

    // If user_id is provided, get payments for that user
    if (user_id) {
      const payments = await PaymentService.getPaymentsByUserId(user_id as string);
      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
      return;
    }

    // Otherwise, get all payments with optional status filter
    let filter = {};
    if (status) {
      filter = { payment_status: status };
    }

    const payments = await PaymentService.getAll();
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: err
    });
  }
};

export const getPaymentByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await PaymentService.getById(req.params.id);
    
    if (!payment) {
      res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    console.error('Error fetching payment:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: err
    });
  }
};

export const updatePaymentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { payment_status, amount, payment_method } = req.body;
    const paymentId = req.params.id;
    
    // Validate payment ID
    if (!Types.ObjectId.isValid(paymentId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid payment ID format'
      });
      return;
    }
    
    // If payment status is provided, update it
    if (payment_status) {
      // Check if the status is valid
      if (!Object.values(PaymentStatus).includes(payment_status as PaymentStatus)) {
        res.status(400).json({
          success: false,
          message: `Invalid payment status. Valid values are: ${Object.values(PaymentStatus).join(', ')}`
        });
        return;
      }
      
      const updatedPayment = await PaymentService.updatePaymentStatus(paymentId, payment_status as PaymentStatus);
      
      if (!updatedPayment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Payment status updated successfully',
        data: updatedPayment
      });
      return;
    }
    
    // If no payment status is provided, update other fields
    const updateData: any = {};
    
    if (amount) {
      updateData.amount = parseFloat(amount);
    }
    
    if (payment_method) {
      updateData.payment_method = payment_method;
    }
    
    // If there are fields to update
    if (Object.keys(updateData).length > 0) {
      const updatedPayment = await PaymentService.update(paymentId, updateData);
      
      if (!updatedPayment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Payment updated successfully',
        data: updatedPayment
      });
      return;
    }
    
    // If no fields to update
    res.status(400).json({
      success: false,
      message: 'No valid fields to update provided'
    });
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating payment',
      error: err
    });
  }
};

export const deletePaymentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPayment = await PaymentService.delete(req.params.id);
    
    if (!deletedPayment) {
      res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
      data: deletedPayment
    });
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting payment',
      error: err
    });
  }
};