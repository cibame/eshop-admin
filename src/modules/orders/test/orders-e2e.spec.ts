import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestUtils } from '../../../../test/utils/test.util';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { OrdersModule } from '../orders.module';

describe('Orders Module', () => {
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    app = await TestUtils.initializeApp([OrdersModule]);
    httpServer = app.getHttpServer();
  });

  beforeEach(async () => {
    await TestUtils.reloadFixtures(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /products API', () => {
    const newOrder: CreateOrderDto = {
      note: 'note',
      user: {
        firstName: 'name',
        lastName: 'lastname',
        email: 'string@string.com',
        address: 'Via tormini',
        telephone: '3292783809',
      },
      products: [
        {
          productId: 1,
          quantity: 3,
        },
      ],
    };

    // From fixtures
    const productPrice = 10;

    it('[NOT-AUTHENTICATED] must create a products ', () => {
      return request(httpServer)
        .post('/orders')
        .send(newOrder)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          // Validate all key in object are presents
          const testElement: Order = body;
          expect(testElement.id).toBe(2);
          // Match user
          expect(testElement.user).toMatchObject(newOrder.user);
          // Match products
          expect(testElement.products.length).toBe(1);
          expect(testElement.products[0].product.id).toBe(
            newOrder.products[0].productId,
          );
          expect(testElement.products[0].quantity).toBe(
            newOrder.products[0].quantity,
          );
          expect(testElement.products[0].price).toBe(productPrice);
        });
    });

    it('[NOT-AUTHENTICATED] must return 400 if one of the product does not exists ', () => {
      const newOrder: CreateOrderDto = {
        note: 'note',
        user: {
          firstName: 'name',
          lastName: 'lastname',
          email: 'string@string.com',
          address: 'Via tormini',
          telephone: '3292783809',
        },
        products: [
          {
            productId: 99,
            quantity: 3,
          },
        ],
      };
      return request(httpServer)
        .post('/orders')
        .send(newOrder)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
