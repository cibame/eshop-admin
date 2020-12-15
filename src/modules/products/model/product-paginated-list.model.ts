import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {PaginatedList} from '../../../shared/service/paginate/model/paginated-list.model';
import {Product} from '../entities/product.entity';

export class ProductPaginatedList extends PaginatedList<Product> {
  @ApiModelProperty({ type: Product, isArray: true })
  items: Product[];
}
