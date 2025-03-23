import { Variant, VariantDocument } from '../models/variant.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';

class VariantService extends BaseService<VariantDocument> {
  constructor() {
    super(Variant);
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
  
  // Update stock quantity
  async updateStock(variantId: string, quantity: number): Promise<VariantDocument | null> {
    return await Variant.findByIdAndUpdate(
      variantId,
      { $inc: { stock: quantity } },
      { new: true }
    );
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