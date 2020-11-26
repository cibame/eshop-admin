import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderProduct } from './entities/order-product.entity';
import { OrderUser } from './entities/order-user.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly _orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly _orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(OrderUser)
    private readonly _orderUserRepository: Repository<OrderUser>,
    @InjectRepository(Product)
    private readonly _productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // Save all the products related to the order
    const products = [];

    for (const orderProductDto of createOrderDto.products) {
      const product = await this._productRepository.findOne(
        orderProductDto.productId,
      );

      if (!product) {
        continue;
      }

      const orderProduct = new OrderProduct();
      orderProduct.price = product.price;
      orderProduct.quantity = orderProductDto.quantity;
      orderProduct.product = product;
      products.push(await this._orderProductRepository.save(orderProduct));
    }

    // Save the user
    const user = this._orderUserRepository.create(createOrderDto.user);
    await this._orderUserRepository.save(user);

    // Finally save the order
    const order = new Order();
    order.note = createOrderDto.note;
    order.products = products;
    order.user = user;

    return await this._orderRepository.save(order);
  }

  findAll() {
    return this._orderRepository.find({
      relations: ['user', 'products', 'products.product'],
    });
  }

  findOne(id: number) {
    return this._orderRepository.findOne(id, {
      relations: ['user', 'products'],
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
