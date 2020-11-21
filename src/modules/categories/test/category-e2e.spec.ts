import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestUtils } from '../../../../test/utils/test.util';
import { CategoriesModule } from '../categories.module';
import { Category } from '../entities/category.entity';

describe('Products Module', () => {
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    app = await TestUtils.initializeApp([CategoriesModule]);
    httpServer = app.getHttpServer();
  });

  beforeEach(async () => {
    await TestUtils.reloadFixtures(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /categories API', () => {
    it('[NOT-AUTHENTICATED] must return all categories ', () => {
      return request(httpServer)
        .get('/categories')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body.length).toEqual(2);
          // Validate all key in object are presents
          const testElement: Category = body[0];
          expect(testElement.id).not.toBeNull();
          expect(testElement.name).not.toBeNull();
        });
    });
  });
});
