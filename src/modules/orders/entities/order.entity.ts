import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderProduct } from './order-product.entity';
import { OrderUser } from './order-user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({ readOnly: true })
  id: number;

  @Column()
  @ApiProperty()
  note: string;

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
  @CreateDateColumn()
  dateCreated: Date;
  @UpdateDateColumn()
  dateUpdated: Date;
}
