import { Product, ProductDocument } from '../models/product.model';
import { BaseService } from './base.service';

class ProductService extends BaseService<ProductDocument> {
  constructor() {
    super(Product);
  }
  
  // You can add custom methods here for specific product operations
  
  // Example: Get products by shop ID
  async getProductsByShopId(shopId: string): Promise<ProductDocument[]> {
    return await Product.find({ shop_id: shopId });
  }
  
  // Example: Get products by category
  async getProductsByCategory(category: string): Promise<ProductDocument[]> {
    return await Product.find({ category });
  }
}

export default new ProductService();