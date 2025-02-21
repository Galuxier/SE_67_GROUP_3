import { Payment, PaymentDocument} from '../models/payment.model';
import { BaseService } from './base.service';

class PaymentService extends BaseService<PaymentDocument>{
    constructor(){
        super(Payment);
    }
}

export default new PaymentService;