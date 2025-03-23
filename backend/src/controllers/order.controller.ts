import { Request, Response } from 'express';
import OrderService from '../services/order.service';
import { Types } from 'mongoose';

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const newOrder = await OrderService.add(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: 'Error creating order', error: err });
  }
};

export const getOrdersController = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAll();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err });
  }
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const order = await OrderService.getById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err });
  }
};

export const updateOrderController = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await OrderService.update(req.params.id, req.body);
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err });
  }
};

export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await OrderService.delete(req.params.id);
    res.status(200).json(deletedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order', error: err });
  }
};

// New controller method to get orders by shop ID
export const getOrdersByShopIdController = async (req: Request, res: Response) => {
  try {
    const { shop_id } = req.params;
    
    // Validate shop_id
    if (!shop_id) {
      res.status(400).json({ message: 'Shop ID is required' });
    }
    
    // Find orders where items contain the specified shop_id
    const orders = await OrderService.getOrdersByShopId(shop_id);
    
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shop orders', error: err });
  }
};