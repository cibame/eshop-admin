import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class JwtModel {
  @ApiModelProperty({required: true})
  jwt: string;

}
