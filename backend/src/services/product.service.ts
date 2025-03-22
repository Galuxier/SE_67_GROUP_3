import { Product, ProductDocument } from '../models/product.model';
import { BaseService } from './base.service';

class ProductService extends BaseService<ProductDocument> {
  constructor() {
    super(Product);
  }
  
  // Add a new method to get products by shop_id
  async getProductsByShopId(shopId: string): Promise<ProductDocument[]> {
    try {
      return await Product.find({ shop_id: shopId });
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();