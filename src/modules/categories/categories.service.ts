import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListQuery } from '../../shared/service/paginate/model/list-query.model';
import { PaginateService } from '../../shared/service/paginate/paginate.service';
import { CategoryPaginatedList } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private readonly paginate: PaginateService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const product = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(product);
  }

  findAll(): Promise<Category[]>;
  findAll(query: ListQuery): Promise<CategoryPaginatedList>;
  findAll(listQuery?: ListQuery): Promise<Category[] | CategoryPaginatedList> {
    if (listQuery) {
      return this.paginate.findAndPaginate(
        listQuery,
        this.categoriesRepository,
        ['name', 'description'],
      );
    }
    return this.categoriesRepository.find();
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.preload({
      id,
      ...updateCategoryDto,
    });
    return await this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    await this.categoriesRepository.delete(id);
  }
}
