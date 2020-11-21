import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class OrderUser {
  @PrimaryGeneratedColumn()
  @ApiProperty({ readOnly: true })
  id: number;

  @Column()
  @ApiProperty({ readOnly: true })
  firstName: string;

  @Column()
  @ApiProperty({ readOnly: true })
  lastName: string;

  @Column({ nullable: false })
  @ApiProperty({ readOnly: true })
  email: string;

  @Column()
  @ApiProperty({ readOnly: true })
  address: string;

  @Column()
  @ApiProperty({ readOnly: true })
  telephone: string;

  @CreateDateColumn()
  dateCreated: Date;
  @CreateDateColumn()
  dateUpdated: Date;
}
