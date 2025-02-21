import { Ticket, TicketDocument} from '../models/ticket.model';
import { BaseService } from './base.service';

class TicketService extends BaseService<TicketDocument>{
    constructor(){
        super(Ticket);
    }
}

export default new TicketService;