import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { PaginatedList } from '../../../shared/service/paginate/model/paginated-list.model';
import { Order } from '../entities/order.entity';

export class OrderPaginatedList extends PaginatedList<Order> {
  @ApiModelProperty({ type: Order, isArray: true })
  items: Order[];
}
