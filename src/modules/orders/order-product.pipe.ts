import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderProductPipe implements PipeTransform {
  constructor(private readonly _productService: ProductsService) {}

  async transform(value: any, _metadata: ArgumentMetadata) {
    const dto: CreateOrderDto = value;
    if (!dto.products) {
      return value;
    }

    const productsIds = dto.products.map(p => p.productId);
    const products = await this._productService.findByIds(productsIds);
    if (products.length !== dto.products.length) {
      const difference = productsIds.filter(
        p => !products.map(pE => pE.id).includes(p),
      );
      throw new BadRequestException(`Products ${difference} does not exists`);
    }

    return value;
  }
}
