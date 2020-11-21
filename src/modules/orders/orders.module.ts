import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { OrderProduct } from './entities/order-product.entity';
import { OrderUser } from './entities/order-user.entity';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    forwardRef(() => ProductsModule),
    TypeOrmModule.forFeature([Order, OrderProduct, OrderUser, Product]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
