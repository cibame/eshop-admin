import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  note: string;
  @Column({ type: 'decimal', nullable: false })
  total: number;
  @CreateDateColumn()
  dateCreated: Date;
  @UpdateDateColumn()
  dateUpdated: Date;
}
