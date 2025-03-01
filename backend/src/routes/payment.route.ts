import express from 'express';
import {
  createPaymentController,
  getPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentController,
} from '../controllers/payment.controller';

const router = express.Router();

router.post('/payments', createPaymentController);
router.get('/payments', getPaymentsController);
router.get('/payment/:id', getPaymentByIdController);
router.put('/payment/:id', updatePaymentController);
router.delete('/payment/:id', deletePaymentController);

export default router;
