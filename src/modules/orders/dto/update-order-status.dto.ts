import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDTo {
  @IsEnum(OrderStatus)
  @ApiProperty()
  status: OrderStatus;

  @IsString()
  @IsOptional()
  @ApiProperty()
  statusChangeNote?: string;
}
