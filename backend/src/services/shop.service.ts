import { Shop, ShopDocument } from '../models/shop.model'
import { BaseService } from './base.service'

class ShopService extends BaseService<ShopDocument>{
    constructor(){
        super(Shop);
    }
}

export default new ShopService();