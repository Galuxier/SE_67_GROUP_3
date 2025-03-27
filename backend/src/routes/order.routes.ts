import express from 'express';
import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  updateOrderController,
  deleteOrderController,
  getOrdersByShopIdController,
} from '../controllers/order.controller';

const router = express.Router();

router.post('/orders', createOrderController);
router.get('/orders', getOrdersController);
router.get('/order/:id', getOrderByIdController);
router.put('/order/:id', updateOrderController);
router.delete('/order/:id', deleteOrderController);
router.get('/shop/:shop_id/orders', getOrdersByShopIdController);

export default router;
