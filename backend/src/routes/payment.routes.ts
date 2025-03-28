import express from 'express';
import {
  createPaymentController,
  getPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentController,
} from '../controllers/payment.controller';
import verifyToken from '../middlewares/auth';

const router = express.Router();

// Create a new payment
// POST /api/payments
router.post('/payments', verifyToken, createPaymentController);

// Get all payments with optional filtering
// GET /api/payments
// GET /api/payments?order_id=123
// GET /api/payments?user_id=123
// GET /api/payments?status=pending
router.get('/payments', getPaymentsController);

// Get a specific payment by ID
// GET /api/payment/123
router.get('/payment/:id', getPaymentByIdController);

// Update payment (including status)
// PUT /api/payment/123
router.put('/payment/:id', verifyToken, updatePaymentController);

// Delete a payment
// DELETE /api/payment/123
router.delete('/payment/:id', verifyToken, deletePaymentController);

export default router;