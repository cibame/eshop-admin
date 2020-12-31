import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {IsEmail, IsNotEmpty} from 'class-validator';

export class SignupDto {
  @ApiModelProperty({format: 'email', required: true})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiModelProperty({required: true})
  @IsNotEmpty()
  firstName: string;

  @ApiModelProperty({required: true})
  @IsNotEmpty()
  lastName: string;

  @ApiModelProperty({required: true})
  @IsNotEmpty()
  phone: string;
}
