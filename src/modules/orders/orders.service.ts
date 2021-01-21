import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListQuery } from '../../shared/service/paginate/model/list-query.model';
import { PaginateService } from '../../shared/service/paginate/paginate.service';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto, CreateOrderProductDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderProduct } from './entities/order-product.entity';
import { OrderUser } from './entities/order-user.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderPaginatedList } from './model/order-paginated-list';
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
    private readonly paginate: PaginateService,
  ) {}

  findAll(): Promise<Order[]>;
  findAll(query: ListQuery): Promise<OrderPaginatedList>;
  async findAll(listQuery?: ListQuery) {
    if (listQuery) {
      return this.paginate.findAndPaginate(
        listQuery,
        this._orderRepository,
        ['note', 'type', 'status', 'uuid', 'user.name', 'user.email'],
        ['user', 'products'],
        // TODO: add relations products.product, this does not work as the relation builder use this.baseAlias (line 44 paginate.service.ts)
      );
    }
    return this._orderRepository.find({
      relations: ['user', 'products', 'products.product'],
    });
  }

  findOne(id: number) {
    return this._orderRepository.findOne(id, {
      relations: ['user', 'products', 'products.product'],
    });
  }

  findOneUUID(uuid: string) {
    return this._orderRepository.findOne({
      where: { uuid },
      relations: ['user', 'products', 'products.product'],
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Save all the products related to the order
    const products = await this.createOrderProducts(createOrderDto.products);

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

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this._orderRepository.findOneOrFail(id, {
      relations: ['user', 'products', 'products.product'],
    });

    if (updateOrderDto.products) {
      // Delete existing products
      await Promise.all(
        order.products.map(p => this._orderProductRepository.remove(p)),
      );

      // Add all new products
      const products = await this.createOrderProducts(updateOrderDto.products);
      order.products = products;
    }

    if (updateOrderDto.user) {
      const user = await this._orderUserRepository.preload({
        id: order.user.id,
        ...updateOrderDto.user,
      });
      await this._orderUserRepository.save(user);
    }

    // change all order details
    order.note = updateOrderDto.note ? updateOrderDto.note : order.note;
    order.type = updateOrderDto.type ? updateOrderDto.type : order.type;

    // Change order detail if neede
    await this._orderRepository.save(order);
    return this.findOne(id);
  }

  private async createOrderProducts(
    orderProducts: CreateOrderProductDto[],
  ): Promise<OrderProduct[]> {
    return Promise.all(orderProducts.map(op => this.createOrderProduct(op)));
  }

  private async createOrderProduct(
    createOrderProduct: CreateOrderProductDto,
  ): Promise<OrderProduct> {
    const product = await this._productRepository.findOneOrFail(
      createOrderProduct.productId,
    );

    const orderProduct = new OrderProduct();
    orderProduct.price = product.price;
    orderProduct.name = product.name;
    orderProduct.quantity = createOrderProduct.quantity;
    orderProduct.product = product;
    return this._orderProductRepository.save(orderProduct);
  }
}
