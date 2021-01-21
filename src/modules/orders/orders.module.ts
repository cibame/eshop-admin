import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginateService } from '../../shared/service/paginate/paginate.service';
import { SharedModule } from '../../shared/shared.module';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { OrderProduct } from './entities/order-product.entity';
import { OrderUser } from './entities/order-user.entity';
import { Order } from './entities/order.entity';
import { OrderProductPipe } from './order-product.pipe';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    forwardRef(() => ProductsModule),
    TypeOrmModule.forFeature([Order, OrderProduct, OrderUser, Product]),
    SharedModule,
  ],
  controllers: [OrdersController],
  // TODO: paginateService is ugly, remote once we have the features online
  providers: [OrdersService, OrderProductPipe, PaginateService],
})
export class OrdersModule {}
