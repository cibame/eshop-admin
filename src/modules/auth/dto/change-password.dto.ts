import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {IsNotEmpty} from 'class-validator';

export class ChangePasswordDto {
  @ApiModelProperty({required: true})
  @IsNotEmpty()
  oldPassword: string;

  @ApiModelProperty({required: true})
  @IsNotEmpty()
  newPassword: string;

}
