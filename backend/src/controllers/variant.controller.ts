import { Request, Response } from 'express';
import VariantService from '../services/variant.service';
import { Types } from 'mongoose';

// Create a new variant
export const createVariantController = async (req: Request, res: Response) => {
  try {
    // Parse attributes if they're sent as a string
    const variantData = { ...req.body };
    
    // Check if attributes is a string and try to parse it
    if (typeof variantData.attributes === 'string') {
      try {
        variantData.attributes = JSON.parse(variantData.attributes);
      } catch (error) {
        console.error('Error parsing attributes JSON:', error);
        res.status(400).json({ 
          success: false,
          message: 'Invalid attributes format', 
          error
        });
        return;
      }
    }

    // Create the variant with parsed attributes
    const newVariant = await VariantService.add(variantData);
    
    res.status(201).json({
      success: true,
      data: newVariant
    });
  } catch (err) {
    console.error('Error creating variant:', err);
    res.status(400).json({ 
      success: false,
      message: 'Error creating variant', 
      error: err 
    });
  }
};

// Create multiple variants in a single operation
export const createManyVariantsController = async (req: Request, res: Response) => {
  try {
    if (!Array.isArray(req.body)) {
      res.status(400).json({
        success: false,
        message: 'Request body must be an array of variants'
      });
      return;
    }

    // Process each variant to ensure attributes are parsed properly
    const processedVariants = req.body.map(variant => {
      const processedVariant = { ...variant };
      
      // Parse attributes if it's a string
      if (typeof processedVariant.attributes === 'string') {
        try {
          processedVariant.attributes = JSON.parse(processedVariant.attributes);
        } catch (error) {
          console.error('Error parsing attributes JSON:', error);
          // Continue with the string value, but log the error
        }
      }
      
      return processedVariant;
    });

    const variants = await VariantService.addMany(processedVariants);
    res.status(201).json({
      success: true,
      count: variants.length,
      data: variants
    });
  } catch (err) {
    console.error('Error creating variants:', err);
    res.status(400).json({ 
      success: false,
      message: 'Error creating variants', 
      error: err 
    });
  }
};

// Get all variants
export const getVariantsController = async (req: Request, res: Response) => {
  try {
    const variants = await VariantService.getAll();
    res.status(200).json({
      success: true,
      count: variants.length,
      data: variants
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching variants',
      error: err
    });
  }
};

// Get a specific variant by ID
export const getVariantByIdController = async (req: Request, res: Response) => {
  try {
    const variant = await VariantService.getById(req.params.id);
    if (!variant) {
      res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: variant
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching variant',
      error: err
    });
  }
};

// Get variants by product ID
export const getVariantsByProductIdController = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    
    if (!Types.ObjectId.isValid(productId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
      return;
    }
    
    const variants = await VariantService.getVariantsByProductId(productId);
    
    res.status(200).json({
      success: true,
      count: variants.length,
      data: variants
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product variants',
      error: err
    });
  }
};

// Update a variant
export const updateVariantController = async (req: Request, res: Response) => {
  try {
    // Parse attributes if they're sent as a string
    const updateData = { ...req.body };
    
    // Check if attributes is a string and try to parse it
    if (typeof updateData.attributes === 'string') {
      try {
        updateData.attributes = JSON.parse(updateData.attributes);
      } catch (error) {
        console.error('Error parsing attributes JSON:', error);
        res.status(400).json({ 
          success: false,
          message: 'Invalid attributes format', 
          error
        });
        return;
      }
    }

    const updatedVariant = await VariantService.update(req.params.id, updateData);
    if (!updatedVariant) {
      res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedVariant
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating variant',
      error: err
    });
  }
};

// Update variant stock
export const updateVariantStockController = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    
    if (quantity === undefined || isNaN(quantity)) {
      res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
      return;
    }
    
    const updatedVariant = await VariantService.updateStock(req.params.id, quantity);
    
    if (!updatedVariant) {
      res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: updatedVariant
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating variant stock',
      error: err
    });
  }
};

// Delete a variant
export const deleteVariantController = async (req: Request, res: Response) => {
  try {
    const deletedVariant = await VariantService.delete(req.params.id);
    if (!deletedVariant) {
      res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: deletedVariant
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting variant',
      error: err
    });
  }
};

// Delete all variants for a product
export const deleteVariantsByProductIdController = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    
    if (!Types.ObjectId.isValid(productId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
      return;
    }
    
    const result = await VariantService.deleteByProductId(productId);
    
    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount || 0} variants`
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product variants',
      error: err
    });
  }
};