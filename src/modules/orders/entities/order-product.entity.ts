import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderProduct {
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
  @ApiProperty({ readOnly: true })
  order: Order;

  @CreateDateColumn()
  dateCreated: Date;
  @CreateDateColumn()
  dateUpdated: Date;
}
