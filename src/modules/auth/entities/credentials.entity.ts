import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { hash } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { IsNumberString } from 'class-validator';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Profile} from './profile.entity';

@Entity()
export class Credentials {
  @ApiModelProperty({ required: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ required: true, format: 'email' })
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @IsNumberString()
  @Exclude()
  code: string;

  @ApiModelProperty({ required: true })
  @OneToOne(() => Profile, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Profile;

  @ApiModelProperty({ required: true, readOnly: true })
  @Column({ default: false })
  active: boolean;

  @ApiModelProperty({ required: true, readOnly: true })
  @Column({ default: false })
  disabled: boolean;

  @ApiModelProperty({
    type: 'string',
    format: 'date-time',
    description: 'yyyy-MM-ddTHH:mm:ss.SSSZ',
  })
  @Column({ type: 'timestamp', default: null })
  updatedAt: Date;

  @ApiModelProperty({
    type: 'string',
    format: 'date-time',
    description: 'yyyy-MM-ddTHH:mm:ss.SSSZ',
  })
  @Column({ type: 'timestamp', default: null })
  createdAt: Date;

  @Exclude()
  private passwordHash: string;

  @AfterLoad()
  loadPasswordHash(): void {
    this.passwordHash = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password && this.password !== this.passwordHash) {
      this.password = await hash(this.password, 10);
    }
  }

  @BeforeInsert()
  setCreatedAtTimestamp() {
    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
  }

  @BeforeUpdate()
  setUpdatedAtTimestamp() {
    this.updatedAt = new Date();
  }

}
