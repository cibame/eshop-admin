import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(
    () => Product,
    product => product.category,
  )
  products: Product[];
  @CreateDateColumn()
  createdDate: Date;
  @CreateDateColumn()
  updateddDate: Date;
}
