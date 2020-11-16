import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Product {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ readOnly: true })
  @Column({ nullable: false })
  name: string;
  @ApiProperty({ readOnly: true })
  @Column({ nullable: true })
  description: string;
  @ApiProperty({ readOnly: true })
  @Column({ type: 'decimal', nullable: false })
  price: number;
  @ApiProperty({ readOnly: true })
  @Column({ nullable: true })
  image: string;
  @ApiProperty({ readOnly: true })
  @ManyToOne(
    () => Category,
    category => category.products,
    { eager: true },
  )
  category: Category;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updateddDate: Date;
}
