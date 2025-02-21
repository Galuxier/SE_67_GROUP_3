import { Cart, CartDocument } from '../models/cart.model';
import {BaseService} from './base.service';

class CartService extends BaseService<CartDocument> {
  constructor() {
    super(Cart);
  }
}

export default new CartService;