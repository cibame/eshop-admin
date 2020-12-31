import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {IsEmail, IsNotEmpty} from 'class-validator';

export class LoginDto {
  @ApiModelProperty({format: 'email', required: true})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiModelProperty({required: true})
  @IsNotEmpty()
  password: string;

}
