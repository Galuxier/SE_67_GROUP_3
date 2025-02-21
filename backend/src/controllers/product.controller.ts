import { Request, Response } from 'express';
import ProductService from '../services/product.service';

export const createProductController = async (req: Request, res: Response) => {
  try {
    const newProduct = await ProductService.add(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error creating product', error: err });
  }
};

export const getProductsController = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getAll();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
};

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await ProductService.update(req.params.id, req.body);
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await ProductService.delete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
};