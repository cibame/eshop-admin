import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PaginateService} from '../../shared/service/paginate/paginate.service';
import {CategoriesModule} from '../categories/categories.module';
import {Category} from '../categories/entities/category.entity';
import {Product} from './entities/product.entity';
import {ProductsController} from './products.controller';
import {ProductsService} from './products.service';

@Module({
  imports: [
    forwardRef(() => CategoriesModule),
    TypeOrmModule.forFeature([Product, Category])
  ],
  controllers: [ProductsController],
  providers: [ProductsService, PaginateService],
  exports: [ProductsService]
})
export class ProductsModule {
}
