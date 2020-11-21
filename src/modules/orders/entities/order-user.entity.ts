import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderUser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'first_name' })
  firstName: string;
  @Column({ nullable: false })
  @Column({ name: 'last_name' })
  lastName: string;
  @Column({ nullable: false })
  email: string;
  @Column()
  address: string;
  @Column()
  telephone: string;
}
