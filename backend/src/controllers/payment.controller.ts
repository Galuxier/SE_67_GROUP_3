import { Request, Response } from 'express';
import PaymentService from '../services/payment.service';

export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const newPayment = await PaymentService.add(req.body);
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(400).json({ message: 'Error creating payment', error: err });
  }
};

export const getPaymentsController = async (req: Request, res: Response) => {
  try {
    const payments = await PaymentService.getAll();
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payments', error: err });
  }
};

export const getPaymentByIdController = async (req: Request, res: Response) => {
  try {
    const payment = await PaymentService.getById(req.params.id);
    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payment', error: err });
  }
};

export const updatePaymentController = async (req: Request, res: Response) => {
  try {
    const updatedPayment = await PaymentService.update(req.params.id, req.body);
    res.status(200).json(updatedPayment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating payment', error: err });
  }
};

export const deletePaymentController = async (req: Request, res: Response) => {
  try {
    const deletedPayment = await PaymentService.delete(req.params.id);
    res.status(200).json(deletedPayment);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting payment', error: err });
  }
};