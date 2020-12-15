import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export abstract class PaginatedList<T> {
  abstract get items(): T[];

  @ApiModelProperty({required: true})
  page: number;

  @ApiModelProperty({required: true})
  pageSize: number;

  @ApiModelProperty({required: true})
  pageCount: number;

  @ApiModelProperty({required: true})
  totalItems: number;
}
