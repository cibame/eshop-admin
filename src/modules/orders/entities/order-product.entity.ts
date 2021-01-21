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
import {
  ColumnNumericTransformer,
  Product,
} from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderProduct extends BaseEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ readOnly: true })
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @ApiProperty({ readOnly: true })
  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @ApiProperty({ readOnly: true })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ readOnly: true })
  @ManyToOne(() => Product, null, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ readOnly: true })
  @ManyToOne(
    () => Order,
    order => order.products,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'orderId' })
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
