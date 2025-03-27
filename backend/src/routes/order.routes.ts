import express from 'express';
import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  // updateOrderController,
  deleteOrderController,
  getOrdersByShopIdController,
  getOrdersByUserIdController,
  updateOrderStatusController
} from '../controllers/order.controller';

const router = express.Router();

router.post('/orders', createOrderController);
router.get('/orders', getOrdersController);
router.get('/order/:id', getOrderByIdController);
// router.put('/order/:id', updateOrderController);
router.delete('/order/:id', deleteOrderController);
router.get('/shop/:shop_id/orders', getOrdersByShopIdController);
router.get('/user/:user_id/orders', getOrdersByUserIdController);
router.patch('/order/:id/status', updateOrderStatusController);


export default router;
