import { AdminModule } from '@admin-bro/nestjs';
import { Database, Resource } from '@admin-bro/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import AdminBro from 'admin-bro';
import { DatabaseType } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AdminController } from './admin-app/controller/admin.controller';
import { OrderResource } from './admin-app/order.resource';
import { Category } from './modules/categories/entities/category.entity';
import { OrderProduct } from './modules/orders/entities/order-product.entity';
import { OrderUser } from './modules/orders/entities/order-user.entity';
import { Product } from './modules/products/entities/product.entity';
import { SharedModule } from './shared/shared.module';

AdminBro.registerAdapter({ Database, Resource });

@Module({
  imports: [
    SharedModule,
    AdminModule.createAdminAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const options: any = {
          adminBroOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: Product,
                options: {
                  listProperties: [
                    'name',
                    'detail',
                    'ingredients',
                    'description',
                    'price',
                  ],
                },
              },
              OrderResource,
              {
                resource: Category,
                options: { listProperties: ['name', 'description'] },
              },
              { resource: OrderProduct },
              { resource: OrderUser },
            ],
          },
        };
        if (configService.get<string>('NODE_ENV') === 'production') {
          options.auth = {
            authenticate: async (email, password) => {
              const adminEmail = configService.get<string>('ADMIN_EMAIL');
              const adminPass = configService.get<string>('ADMIN_PASS');
              if (email !== adminEmail || password !== adminPass) {
                return Promise.resolve(null);
              }
              return Promise.resolve({
                email: configService.get<string>('ADMIN_EMAIL'),
              });
            },
            cookieName: 'admin_name',
            cookiePassword: 'admin_password',
          };
        }

        return options;
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<DatabaseType>('DB_TYPE'),
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        } as PostgresConnectionOptions;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController],
  providers: [],
})
export class AppAdminModule {}
