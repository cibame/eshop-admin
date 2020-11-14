import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [TypeOrmModule.forRoot(), ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
