import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {IsIn, IsNumberString, IsOptional} from 'class-validator';

export class ListQuery {

  @IsOptional()
  @ApiModelProperty({
    required: false
  })
  readonly filter: string;

  @IsNumberString()
  @IsOptional()
  @ApiModelProperty({
    required: false
  })
  readonly page: number;

  @IsOptional()
  @IsNumberString()
  @ApiModelProperty({
    required: false
  })
  readonly pageSize: number;

  @IsOptional()
  @ApiModelProperty({
    required: false
  })
  readonly sort?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @ApiModelProperty({
    required: false,
    enum: ['ASC', 'DESC']
  })
  readonly sortOrder: string;
}
