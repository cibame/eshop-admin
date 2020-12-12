import {
  BadRequestException,
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
import { CategoriesService } from '../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductGuard } from './guard/product.guard';
import { ProductsService } from './products.service';

@Controller('products')
@ApiTags('products')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoryService: CategoriesService,
  ) {}

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

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    if (
      createProductDto.categoryId &&
      !(await this.categoryService.findOne(createProductDto.categoryId))
    ) {
      throw new BadRequestException(
        `Category ${createProductDto.categoryId} does not exists`,
      );
    }

    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(ProductGuard)
  @ApiResponse({
    type: Product,
    description:
      'In order to remove an existing category, expicitly set "categoryID" to null ',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    if (
      updateProductDto.categoryId &&
      !(await this.categoryService.findOne(updateProductDto.categoryId))
    ) {
      throw new BadRequestException(
        `Category ${updateProductDto.categoryId} does not exists`,
      );
    }

    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(ProductGuard)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
  }
}
