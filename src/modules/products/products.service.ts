import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ListQuery} from '../../shared/service/paginate/model/list-query.model';
import {PaginateService} from '../../shared/service/paginate/paginate.service';
import {Category} from '../categories/entities/category.entity';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {Product} from './entities/product.entity';
import {ProductPaginatedList} from './model/product-paginated-list.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly paginate: PaginateService
  ) {
  }

  async create(createProductDto: CreateProductDto) {
    const category = createProductDto.categoryId
      ? await this.categoryRepository.findOne(createProductDto.categoryId)
      : null;
    const product = this.productRepository.create(createProductDto);
    product.category = category;
    return await this.productRepository.save(product);
  }

  findAll(): Promise<Product[]>;
  findAll(query: ListQuery): Promise<ProductPaginatedList>;

  async findAll(listQuery?: ListQuery): Promise<Product[] | ProductPaginatedList> {
    if (listQuery) {
      return this.paginate.findAndPaginate(
        listQuery,
        this.productRepository,
        ['name', 'description', 'ingredients', 'category.name', 'category.description'],
        ['category']
      );
    }
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOne(id);
  }

  findByIds(ids: number[]) {
    return this.productRepository.findByIds(ids);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto
    });

    if (updateProductDto.categoryId) {
      product.category = await this.categoryRepository.findOne(
        updateProductDto.categoryId
      );
    } else if (updateProductDto.categoryId === null) {
      product.category = null;
    }

    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.softDelete(id);
  }
}
