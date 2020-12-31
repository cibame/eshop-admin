import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
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

    const queryBuilder = repository.createQueryBuilder(this.baseAlias)
      .where(where)
      .take(pageSize)
      .skip(page * pageSize)
      .orderBy(sort.indexOf('.') < 0 ? this.baseAlias + '.' + sort : sort, sortOrder);

    // build join clause
    relations.forEach(relation => queryBuilder.leftJoinAndSelect(this.baseAlias + '.' + relation, relation));

    const [items, totalItems] = await queryBuilder.getManyAndCount();

    return {
      items,
      page,
      pageSize,
      pageCount: Math.ceil(totalItems / pageSize),
      totalItems
    };
  }
}
