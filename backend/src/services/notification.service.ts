import { Notification, NotificationDocument} from '../models/notification.model';
import { BaseService } from './base.service';

class NotificationService extends BaseService<NotificationDocument>{
    constructor(){
        super(Notification);
    }
}

export default new NotificationService;