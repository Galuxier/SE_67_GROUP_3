import { Cart, CartDocument } from '../models/cart.model';
import {BaseService} from './base.service';

export class CartService extends BaseService<CartDocument> {
  constructor() {
    super(Cart);
  }
}