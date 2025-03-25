import express from 'express';
import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  updateOrderController,
  deleteOrderController,
} from '../controllers/order.controller';

const router = express.Router();

router.post('/orders', createOrderController);
router.get('/orders', getOrdersController);
router.get('/order/:id', getOrderByIdController);
router.put('/order/:id', updateOrderController);
router.delete('/order/:id', deleteOrderController);

export default router;
