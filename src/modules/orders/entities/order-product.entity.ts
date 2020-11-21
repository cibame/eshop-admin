import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int', nullable: false })
  quantity: number;
  @Column({ type: 'decimal', nullable: false })
  price: number;
  @ManyToOne(() => Product, null, {})
  product: Product;
}
