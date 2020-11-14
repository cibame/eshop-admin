import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // TODO: create category and setup relation
  // category:
}
