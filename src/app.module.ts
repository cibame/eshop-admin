import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forRoot(), ProductsModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
