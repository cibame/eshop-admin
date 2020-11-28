import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ readOnly: true })
  id: number;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({ readOnly: true })
  quantity: number;

  @Column({ type: 'decimal', nullable: false })
  @ApiProperty({ readOnly: true })
  price: number;

  @ManyToOne(() => Product, null, {})
  @ApiProperty({ readOnly: true })
  product: Product;

  @ManyToOne(
    () => Order,
    order => order.products,
  )
  @JoinColumn()
  @ApiProperty({ readOnly: true })
  order: Order;

  // in order be able to fetch resources in admin-bro - we have to have id available
  @RelationId((orderProduct: OrderProduct) => orderProduct.order)
  orderId: number;

  @RelationId((orderProduct: OrderProduct) => orderProduct.product)
  productId: number;

  @CreateDateColumn()
  dateCreated: Date;
  @CreateDateColumn()
  dateUpdated: Date;
}
