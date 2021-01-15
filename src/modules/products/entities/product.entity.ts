import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
export class Product extends BaseEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ readOnly: true })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ readOnly: true })
  @Column({ nullable: true })
  detail: string;

  @ApiProperty({ readOnly: true })
  @Column({ nullable: true })
  ingredients: string;

  @ApiProperty({ readOnly: true })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ readOnly: true })
  @Column({ default: true })
  active: boolean;

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
    { nullable: true, eager: true, onDelete: 'SET NULL' },
  )
  category: Category;

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updateddDate: Date;
  @DeleteDateColumn()
  deletedDate: Date;
}
