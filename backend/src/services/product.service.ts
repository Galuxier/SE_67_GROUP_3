import { Product, ProductDocument } from '../models/product.model';
import { BaseService } from './base.service';
import VariantService from './variant.service';
import { Types } from 'mongoose';

class ProductService extends BaseService<ProductDocument> {
  constructor() {
    super(Product);
  }
  
  // Get products by shop ID
  async getProductsByShopId(shopId: string): Promise<ProductDocument[]> {
    return await Product.find({ shop_id: new Types.ObjectId(shopId) });
  }
  
  // Get products by category
  async getProductsByCategory(category: string): Promise<ProductDocument[]> {
    return await Product.find({ category });
  }

  // Get product with its variants
  async getProductWithVariants(productId: string | Types.ObjectId): Promise<any> {
    const product = await this.getById(productId.toString());
    if (!product) return null;
    
    const variants = await VariantService.getVariantsByProductId(productId.toString());
    
    return {
      ...product.toObject(),
      variants
    };
  }

  // Delete a product and all its variants
  async deleteProductWithVariants(productId: string): Promise<any> {
    // First delete all product variants
    await VariantService.deleteByProductId(productId);
    
    // Then delete the product
    const deletedProduct = await this.delete(productId);
    
    return deletedProduct;
  }

  // Search products with optional conditions
  async searchProducts(
    query: string,
    category?: string,
    shopId?: string,
    minPrice?: number,
    maxPrice?: number,
    page: number = 1,
    limit: number = 10,
    sort?: string // เพิ่ม sort parameter
  ): Promise<{ products: ProductDocument[], total: number }> {
    const filter: any = {};
    
    // Add search query condition
    if (query && query.trim().length > 0) {
      const searchRegex = new RegExp(query, 'i');
      filter.$or = [
        { product_name: searchRegex },
        { description: searchRegex }
      ];
    }
    
    // Add category filter
    if (category) {
      filter.category = category;
    }
    
    // Add shop filter
    if (shopId) {
      filter.shop_id = new Types.ObjectId(shopId);
    }
    
    // Add price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.base_price = {};
      if (minPrice !== undefined) filter.base_price.$gte = minPrice;
      if (maxPrice !== undefined) filter.base_price.$lte = maxPrice;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Define sort options
    let sortOption: any = { created_at: -1 }; // Default sort by created_at DESC
    if (sort === 'low-to-high') {
      sortOption = { base_price: 1 }; // Sort by price ASC
    } else if (sort === 'high-to-low') {
      sortOption = { base_price: -1 }; // Sort by price DESC
    }
    
    // Execute query
    const products = await Product.find(filter)
      .sort(sortOption) // ใช้ sortOption
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    return { products, total };
  }
}

export default new ProductService();