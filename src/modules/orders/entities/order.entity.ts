import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { OrderProduct } from './order-product.entity';
import { OrderUser } from './order-user.entity';

export enum OrderType {
  Pickup = 'pickup',
  Delivery = 'delivery',
}

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ readOnly: true })
  id: number;

  @Column()
  @ApiProperty()
  note: string;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.Pickup,
    nullable: false,
  })
  @ApiProperty()
  type: OrderType;

  @OneToOne(() => OrderUser)
  @JoinColumn()
  @ApiProperty({ type: () => OrderUser, readOnly: true })
  user: OrderUser;

  @OneToMany(
    () => OrderProduct,
    product => product.order,
  )
  @ApiProperty({ type: () => OrderProduct, readOnly: true })
  products: OrderProduct[];
  // TODO: add a total computed column

  @RelationId((order: Order) => order.user)
  userId: number;

  @CreateDateColumn()
  dateCreated: Date;
  @UpdateDateColumn()
  dateUpdated: Date;
}
