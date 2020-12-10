import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderProduct } from './entities/order-product.entity';
import { OrderUser } from './entities/order-user.entity';
import { Order, OrderStatus } from './entities/order.entity';
import uuid = require('uuid');

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
    order.type = createOrderDto.type;
    order.user = user;
    order.status = OrderStatus.WaitingConfirmation;
    order.uuid = uuid.v4();

    return await this._orderRepository.save(order);
  }

  findOne(uuid: string) {
    return this._orderRepository.findOne({
      where: { uuid },
      relations: ['user', 'products', 'products.product'],
    });
  }

  findAll() {
    return this._orderRepository.find({
      relations: ['user', 'products', 'products.product'],
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
