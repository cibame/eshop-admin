import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Category extends BaseEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ readOnly: true })
  @Column()
  name: string;
  @ApiProperty({ readOnly: true })
  @Column({ nullable: true })
  description: string;
  @ApiProperty({ readOnly: true, type: () => Product, isArray: true })
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
