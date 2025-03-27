import { Request, Response } from 'express';
import OrderService from '../services/order.service';
import { Types } from 'mongoose';
import { OrderStatus } from '../models/order.model';

export const createOrderController = async (req: Request, res: Response) => {
  try {
    console.log("req.body: ", req.body);
    
    const newOrder = await OrderService.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    console.log(err);
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
    const { status } = req.query; // Get status from query parameters
    
    // Validate shop_id
    if (!shop_id) {
      res.status(400).json({ 
        success: false, 
        message: 'Shop ID is required' 
      });
      return ;
    }
    
    // Validate status if provided
    if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Valid values are: ${Object.values(OrderStatus).join(', ')}`
      });
      return ;
    }
    
    // Get orders for the shop with optional status filter
    const orders = await OrderService.getOrdersByShopId(shop_id, status as string | undefined);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    console.error('Error fetching shop orders:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching shop orders', 
      error: err 
    });
  }
};

export const getOrdersByUserIdController = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    
    // Validate shop_id
    if (!user_id) {
      res.status(400).json({ message: 'User ID is required' });
    }
    
    // Find orders where items contain the specified shop_id
    const orders = await OrderService.getOrdersByUserId(user_id);
    
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shop orders', error: err });
  }
};

export const updateOrderStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !Object.values(OrderStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
      return;
    }
    
    const updatedOrder = await OrderService.updateOrderStatus(id, status);
    
    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: err
    });
  }
};