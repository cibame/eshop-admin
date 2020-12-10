import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(__dirname + '/migration/*.{.ts,.js}');
        return {
          type: configService.get<DatabaseType>('DB_TYPE'),
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migration/*{.ts,.js}'],
          migrationsRun: true,
          logging: ['info', 'log', 'migration'],
        } as PostgresConnectionOptions;
      },
      inject: [ConfigService],
    }),

    // Feature modules
    CategoriesModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
