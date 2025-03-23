import { Request, Response } from 'express';
import ProductService from '../services/product.service';
import VariantService from '../services/variant.service';
import { Types } from 'mongoose';

export const createProductController = async (req: Request, res: Response) => {
  try {
    // Extract product data
    const { 
      shop_id, 
      product_name, 
      category, 
      description,
      base_price,
      variantData  // This might come as a JSON string
    } = req.body;

    // Process image URLs from the upload middleware
    const product_image_urls = req.body.product_image_urls || [];
    
    // Create the product data object
    const productData = {
      shop_id,
      product_name,
      category,
      description,
      base_price: parseFloat(base_price),
      product_image_urls: Array.isArray(product_image_urls) ? product_image_urls : [product_image_urls]
    };
    
    // Save the product
    const newProduct = await ProductService.add(productData);
    
    // Parse variants data if it's provided as a string
    let variants = [];
    if (variantData) {
      try {
        // Try to parse if it's a string
        variants = typeof variantData === 'string' ? JSON.parse(variantData) : variantData;
      } catch (error) {
        console.error('Error parsing variant data:', error);
        // Continue without variants, but log the error
      }
    }
    
    // If variants are provided, save them with the product ID
    if (variants && Array.isArray(variants) && variants.length > 0) {
      // Add product_id to each variant and ensure attributes are parsed
      const variantsWithProductId = variants.map(variant => {
        const processedVariant = { ...variant, product_id: newProduct._id };
        
        // Make sure attributes is a proper object, not a string
        if (typeof processedVariant.attribute === 'string') {
          try {
            processedVariant.attributes = JSON.parse(processedVariant.attribute);
            delete processedVariant.attribute; // Remove the old attribute field
          } catch (error) {
            console.error('Error parsing variant attribute:', error);
            processedVariant.attributes = {}; // Default to empty object if parsing fails
          }
        } else if (processedVariant.attribute && !processedVariant.attributes) {
          // If attribute exists but attributes doesn't, copy attribute to attributes
          processedVariant.attributes = processedVariant.attribute;
          delete processedVariant.attribute;
        }
        
        return processedVariant;
      });
      
      // Save variants
      await VariantService.addMany(variantsWithProductId);
    }
    
    // Get the complete product with variants
    const completeProduct = await ProductService.getProductWithVariants(newProduct._id as unknown as string);
    
    // Send success response
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: completeProduct
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
    // Extract query parameters
    const { 
      query = '', 
      category, 
      shop_id, 
      min_price, 
      max_price,
      page = '1',
      limit = '10'
    } = req.query;
    
    // Parse numeric parameters
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const minPrice = min_price ? parseFloat(min_price as string) : undefined;
    const maxPrice = max_price ? parseFloat(max_price as string) : undefined;
    
    // Search for products with filters
    const { products, total } = await ProductService.searchProducts(
      query as string,
      category as string | undefined,
      shop_id as string | undefined,
      minPrice,
      maxPrice,
      pageNum,
      limitNum
    );
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: products
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching products', 
      error: err 
    });
  }
};

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    // Get product with its variants
    const product = await ProductService.getProductWithVariants(req.params.id);
    
    if (!product) {
      res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching product', 
      error: err 
    });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    // Update product data
    const updatedProduct = await ProductService.update(req.params.id, req.body);
    
    if (!updatedProduct) {
      res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
      return;
    }
    
    // Get the updated product with its variants
    const completeProduct = await ProductService.getProductWithVariants(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: completeProduct
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating product', 
      error: err 
    });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    // Delete product and all its variants
    const deletedProduct = await ProductService.deleteProductWithVariants(req.params.id);
    
    if (!deletedProduct) {
      res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Product and all variants deleted successfully',
      data: deletedProduct
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting product', 
      error: err 
    });
  }
};

export const getProductsByShopIdController = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;
    
    // Validate shop ID
    if (!Types.ObjectId.isValid(shopId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid shop ID format'
      });
      return;
    }
    
    const products = await ProductService.getProductsByShopId(shopId);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching shop products', 
      error: err 
    });
  }
};