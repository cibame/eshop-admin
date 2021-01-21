import { ApiProperty } from '@nestjs/swagger';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
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

export enum OrderStatus {
  WaitingConfirmation = 'waiting-confirmation',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Delivered = 'delivered',
}

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ readOnly: true })
  id: number;

  @Column()
  @ApiProperty({ readOnly: true })
  note: string;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.Pickup,
    nullable: false,
  })
  @ApiProperty({ readOnly: true })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.WaitingConfirmation,
    nullable: false,
  })
  @ApiProperty({ readOnly: true })
  status: OrderStatus;

  @Column({ nullable: true })
  @ApiProperty({ readOnly: true })
  statusChangeNote?: string;

  @Column({ nullable: false })
  @ApiProperty({ readOnly: true })
  uuid: string;

  @OneToOne(() => OrderUser, { eager: true })
  @JoinColumn()
  @ApiProperty({ type: () => OrderUser, readOnly: true })
  user: OrderUser;

  @OneToMany(
    () => OrderProduct,
    product => product.order,
    { eager: true },
  )
  @ApiProperty({ type: () => OrderProduct, readOnly: true })
  products: OrderProduct[];

  //TODO: remove all admin=bro related stuff from entities
  @RelationId((order: Order) => order.user)
  userId: number;

  @ApiProperty({ readOnly: true })
  total = 0;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  calculateTotal() {
    const total = this.products?.reduce(
      (acc, val) => acc + val.quantity * val.price,
      0,
    );
    this.total = total;
  }

  @CreateDateColumn()
  dateCreated: Date;
  @UpdateDateColumn()
  dateUpdated: Date;
}
