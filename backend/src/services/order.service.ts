import { Order, OrderDocument } from '../models/order.model';

export const createOrder = async (orderData: OrderDocument) => {
  return await Order.create(orderData);
};

export const getOrders = async () => {
  return await Order.find().populate('user products.product');
};

export const getOrderById = async (orderId: string) => {
  return await Order.findById(orderId).populate('user products.product');
};

export const updateOrder = async (orderId: string, updateData: Partial<OrderDocument>) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');
  Object.assign(order, updateData);
  return await order.save();
};

export const deleteOrder = async (orderId: string) => {
  return await Order.findByIdAndDelete(orderId);
};
