import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class ProductGuard implements CanActivate {
  constructor(private readonly productsService: ProductsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.params['id'];
    if (!id) {
      throw new NotFoundException();
    }

    const product = await this.productsService.findOne(+id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} does not exits`);
    }

    request.product = product;
    return true;
  }
}
