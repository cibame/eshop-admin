import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from '../orders.service';

@Injectable()
export class OrderGuard implements CanActivate {
  constructor(private readonly orderService: OrdersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.params['id'];
    if (!id) {
      throw new NotFoundException();
    }

    const order = await this.orderService.findOne(+id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} does not exits`);
    }

    request.order = order;
    return true;
  }
}
