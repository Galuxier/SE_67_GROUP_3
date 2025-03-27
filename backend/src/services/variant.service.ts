import { Variant, VariantDocument, VariantStatus } from '../models/variant.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';

class VariantService extends BaseService<VariantDocument> {
  constructor() {
    super(Variant);
  }

  async updateStock(variantId: string, quantityChange: number): Promise<VariantDocument | null> {
    try {
      // Find the variant
      const variant = await Variant.findById(variantId);
      
      if (!variant) {
        throw new Error(`Variant ${variantId} not found`);
      }
      
      // Check if we have enough stock (for decreases)
      if (quantityChange < 0 && variant.stock + quantityChange < 0) {
        throw new Error(`Not enough stock for variant ${variantId}`);
      }
      
      // Update the stock
      variant.stock += quantityChange;
      
      // If stock reaches 0, update the status to out of stock
      if (variant.stock === 0) {
        variant.status = VariantStatus.OutOfStock;
      } else if (variant.status === VariantStatus.OutOfStock && variant.stock > 0) {
        // If stock was out but now has inventory, mark as active
        variant.status = VariantStatus.Active;
      }
      
      // Save the updated variant
      await variant.save();
      
      return variant;
    } catch (error) {
      console.error(`Error updating stock for variant ${variantId}:`, error);
      throw error;
    }
  }

  /**
 * Adjusts the stock quantity of a variant
 * @param variantId Variant ID to update
 * @param quantityChange Amount to adjust stock by (positive to increase, negative to decrease)
 * @param session Mongoose session for transaction
 * @returns Updated variant document or null if not found
 */
  async adjustStock(variantId: string, quantityChange: number, session: any): Promise<VariantDocument | null> {
    const variant = await Variant.findById(variantId, null, { session });
    
    if (!variant) {
      throw new Error(`Variant not found: ${variantId}`);
    }
    
    // Check if stock will become negative
    if (variant.stock + quantityChange < 0) {
      throw new Error(`Insufficient stock for variant: ${variantId}. Available: ${variant.stock}, Requested: ${Math.abs(quantityChange)}`);
    }
    
    // Update stock
    variant.stock += quantityChange;
    
    // Update status if stock becomes zero
    if (variant.stock === 0) {
      variant.status = VariantStatus.OutOfStock;
    } else if (variant.status === 'out_of_stock' && variant.stock > 0) {
      variant.status = VariantStatus.Active;
    }
    
    await variant.save({ session });
    return variant;
  }
  
  // Get all variants for a specific product
  async getVariantsByProductId(productId: string): Promise<VariantDocument[]> {
    return await Variant.find({ product_id: new Types.ObjectId(productId) });
  }
  
  // Create multiple variants in a single operation
  async addMany(variants: Array<Partial<VariantDocument>>): Promise<VariantDocument[]> {
    const result = await Variant.insertMany(variants);
    return result as unknown as VariantDocument[];
  }

  // Delete all variants for a product (useful when deleting a product)
  async deleteByProductId(productId: string): Promise<{ deletedCount?: number }> {
    const result = await Variant.deleteMany({ product_id: new Types.ObjectId(productId) });
    return { deletedCount: result.deletedCount };
  }

  // Search variants by multiple criteria
  async searchVariants(criteria: Record<string, any>): Promise<VariantDocument[]> {
    return await Variant.find(criteria);
  }
}

export default new VariantService();