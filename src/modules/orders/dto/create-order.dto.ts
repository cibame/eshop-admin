import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderType } from '../entities/order.entity';

export class CreateOrderProductDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  productId: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  price?: number;
}

export class CreateOrderUserDto {
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsPhoneNumber('IT')
  @ApiProperty()
  telephone: string;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  note: string;

  @IsEnum(OrderType)
  @ApiProperty({ enum: OrderType })
  type: OrderType;

  @ValidateNested()
  @ApiProperty({ type: () => CreateOrderUserDto })
  @IsNotEmpty()
  @Type(() => CreateOrderUserDto)
  user: CreateOrderUserDto;

  @ValidateNested()
  @ApiProperty({ type: () => CreateOrderProductDto, isArray: true })
  @IsNotEmpty()
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];
}
