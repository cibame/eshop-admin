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

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

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
  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;
  @ApiProperty({ readOnly: true })
  @Column({ nullable: true })
  image: string;
  @ApiProperty({ readOnly: true, type: () => Category })
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
