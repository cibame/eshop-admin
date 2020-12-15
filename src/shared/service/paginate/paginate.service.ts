import {Injectable} from '@nestjs/common';
import {FindManyOptions, Repository} from 'typeorm';
import {ListQuery} from './model/list-query.model';
import {PaginatedList} from './model/paginated-list.model';

@Injectable()
export class PaginateService {
  private baseAlias = 'base_entity';

  async findAndPaginate<T>(query: ListQuery, repository: Repository<T>, filterFields: string[] = [], relations: string[] = []): Promise<PaginatedList<T>> {
    const page = +query.page || 0;
    const pageSize = +query.pageSize || 10;
    const sort = query.sort || 'id';
    const sortOrder: 'ASC' | 'DESC' | 1 | -1 = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const filter = query.filter || '';

    const filterStrings = filter.split(' ').map(filterString => filterString.trim()).filter(filterString => !!filterString);

    // build where clause
    let where = '';
    filterStrings.forEach((filterString, index) => {
      if (index > 0) {
        where += (' AND ');
      }
      where += ('(');
      filterFields
        .map(filterField => filterField.indexOf('.') < 0 ? this.baseAlias + '.' + filterField : filterField)
        .forEach((filterField, index) => {
          if (index > 0) {
            where += (' OR ');
          }
          where += (`${filterField} ILIKE '%${filterString}%'`);
        });
      where += (')');
    });

    // build join clause
    const leftJoin = {};
    relations.forEach(relation => leftJoin[relation] = this.baseAlias + '.' + relation);

    const options: FindManyOptions = {
      where,
      order: {[sort]: sortOrder},
      take: pageSize,
      skip: page * pageSize,
      join: {alias: this.baseAlias, leftJoin}
    };

    const [items, totalItems] = await repository.findAndCount(options);

    return {
      items,
      page,
      pageSize,
      pageCount: Math.ceil(totalItems / pageSize),
      totalItems
    };
  }
}
