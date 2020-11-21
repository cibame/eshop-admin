import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductGuard } from './guard/product.guard';
import { ProductsService } from './products.service';

@Controller('products')
@ApiTags('products')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiResponse({ type: Product, isArray: true })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  @UseGuards(ProductGuard)
  @ApiResponse({ type: Product })
  findOne(@Param('id') _: string, @Req() req): Promise<Product> {
    return req.product;
  }

  @Put(':id')
  @UseGuards(ProductGuard)
  @ApiResponse({ type: Product })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(ProductGuard)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
  }
}
