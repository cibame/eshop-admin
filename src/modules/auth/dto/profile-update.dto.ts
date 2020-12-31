import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {IsEmail, IsOptional} from 'class-validator';

export class ProfileUpdateDto {
  @ApiModelProperty({format: 'email', required: false})
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiModelProperty({required: false})
  @IsOptional()
  firstName: string;

  @ApiModelProperty({required: false})
  @IsOptional()
  lastName: string;

  @ApiModelProperty({required: false})
  @IsOptional()
  phone: string;

  @ApiModelProperty({required: false})
  @IsOptional()
  businessName: string;

}
