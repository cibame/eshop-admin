import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from '../categories.service';

// TODO: this kind of guard can be made generic
@Injectable()
export class CategoriesGuard implements CanActivate {
  constructor(private readonly categoriesService: CategoriesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.params['id'];
    if (!id) {
      throw new NotFoundException();
    }

    const category = await this.categoriesService.findOne(+id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} does not exits`);
    }

    request.category = category;
    return true;
  }
}
