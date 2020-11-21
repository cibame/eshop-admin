import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestUtils } from '../../../../test/utils/test.util';
import { Product } from '../entities/product.entity';
import { ProductsModule } from '../products.module';

describe('Products Module', () => {
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    app = await TestUtils.initializeApp([ProductsModule]);
    httpServer = app.getHttpServer();
  });

  beforeEach(async () => {
    await TestUtils.reloadFixtures(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /products API', () => {
    it('[NOT-AUTHENTICATED] must return all products ', () => {
      return request(httpServer)
        .get('/products')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body.length).toEqual(12);
          // Validate all key in object are presents
          const testElement: Product = body[0];
          expect(testElement.id).not.toBeNull();
          expect(testElement.name).not.toBeNull();
          expect(testElement.description).not.toBeNull();
          expect(testElement.price).not.toBeNull();
          expect(testElement.image).not.toBeNull();
        });
    });
  });
});
