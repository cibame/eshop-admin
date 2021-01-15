import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  ingredients?: string;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @Min(0)
  categoryId?: number;
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  available?: boolean;
  @IsBase64()
  @IsOptional()
  image?: string;
}
