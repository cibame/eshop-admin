import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {IsEmail, IsNotEmpty} from 'class-validator';

export class ResetPasswordDto {

  @ApiModelProperty({format: 'email', required: true})
  @IsNotEmpty()
  @IsEmail()
  email: string;

}
