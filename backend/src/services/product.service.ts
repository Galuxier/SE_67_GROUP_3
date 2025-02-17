import { Product, ProductDocument } from '../models/product.model';
import {BaseService} from './base.service';

export class UserService extends BaseService<ProductDocument> {
  constructor() {
    super(Product);
  }
}