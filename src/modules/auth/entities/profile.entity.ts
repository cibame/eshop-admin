import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

export enum ProfileType {
  lite = 'LITE',
  standard = 'STANDARD',
  pro = 'PRO'
}

@Entity()
export class Profile {
  @ApiModelProperty({required: true})
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiModelProperty({required: true})
  @Column({nullable: false})
  firstName: string;

  @ApiModelProperty({required: true})
  @Column({nullable: false})
  lastName: string;

  @ApiModelProperty({required: true, enum: Object.values(ProfileType)})
  @Column({nullable: false})
  profileType: ProfileType;

  @ApiModelProperty({ required: true, format: 'email' })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiModelProperty({required: true})
  @Column({nullable: false})
  phone: string;

  @ApiModelProperty({required: false})
  @Column({nullable: true})
  businessName: string;

}
