import { Product, ProductDocument } from '../models/product.model';
import {BaseService} from './base.service';

class UserService extends BaseService<ProductDocument> {
  constructor() {
    super(Product);
  }
}

export default new UserService;