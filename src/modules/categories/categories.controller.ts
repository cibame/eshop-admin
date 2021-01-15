import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ListQuery } from '../../shared/service/paginate/model/list-query.model';
import { PaginatedList } from '../../shared/service/paginate/model/paginated-list.model';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoriesGuard } from './guard/categories.guard';

export class CategoryPaginatedList extends PaginatedList<Category> {
  @ApiModelProperty({ type: Category, isArray: true })
  items: Category[];
}

@Controller('categories')
@ApiTags('categories')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({ type: Category, isArray: true })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('/paginated')
  @ApiResponse({ type: CategoryPaginatedList })
  findPaginated(@Query() query: ListQuery): Promise<CategoryPaginatedList> {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(CategoriesGuard)
  @ApiResponse({ type: Category })
  findOne(@Param('id') _: string, @Req() req) {
    return req.category;
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(CategoriesGuard)
  @ApiResponse({ type: Category })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(CategoriesGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
