import { Request, Response } from 'express';
import ProductService from '../services/product.service';

export const createProductController = async (req: Request, res: Response) => {
  try {
    // Extract the basic product data
    const { 
      shop_id, 
      product_name, 
      category, 
      description,
      variantCount // We don't need to use this directly, just extracted here for clarity
    } = req.body;
    
    // Process image URLs from the upload middleware
    const product_image_urls = req.body.product_image_urls || [];
    
    // Initialize an array to store variant data
    const variants = [];
    
    // Parse variants from form data
    const variantKeys = Object.keys(req.body).filter(key => key.startsWith('variants['));
    
    // Group variant keys by index
    const variantIndices = new Set();
    variantKeys.forEach(key => {
      const match = key.match(/variants\[(\d+)\]/);
      if (match) {
        variantIndices.add(match[1]);
      }
    });
    
    // Process each variant
    for (const index of variantIndices) {
      try {
        const price = parseFloat(req.body[`variants[${index}][price]`] || '0');
        const stock = parseInt(req.body[`variants[${index}][stock]`] || '0');
        const attribute = req.body[`variants[${index}][attribute]`] ? 
          JSON.parse(req.body[`variants[${index}][attribute]`]) : {};
        const image_url = req.body[`variants[${index}][variant_image_url]`] || '';
        
        variants.push({
          attribute,
          image_url,
          price,
          stock
        });
      } catch (err) {
        console.error(`Error processing variant ${index}:`, err);
        // Continue with other variants
      }
    }
    
    // Create the product data object
    const productData = {
      shop_id,
      product_name,
      category,
      description,
      image_url: Array.isArray(product_image_urls) ? product_image_urls : [product_image_urls],
      variants
    };
    
    // Save the product
    const newProduct = await ProductService.add(productData);
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ 
      success: false,
      message: 'Error creating product', 
      error: err 
    });
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

// New controller to get products by shop_id
export const getProductsByShopIdController = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;
    const products = await ProductService.getProductsByShopId(shopId);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shop products', error: err });
  }
};