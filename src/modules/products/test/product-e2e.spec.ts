import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestUtils } from '../../../../test/utils/test.util';
import { CreateProductDto } from '../dto/create-product.dto';
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
          expect(testElement.active).toBeTruthy();
        });
    });
  });

  describe('POST /products API', () => {
    const product: CreateProductDto = {
      name: 'test',
      description: 'test product',
      ingredients: 'three spoon of sugar',
      price: 15,
    };

    it('must create a product with a category associated', async () => {
      const createProduct = { ...product, categoryId: 1 };

      const { body } = await request(httpServer)
        .post('/products')
        .send(createProduct)
        .expect(HttpStatus.CREATED);

      // Validate all key in object are presents
      const testElement: Product = body;
      expect(testElement.id).not.toBeNull();
      expect(testElement).toMatchObject(product);
      expect(testElement.category.id).toBe(createProduct.categoryId);
    });

    it('must create a product without a category associated', async () => {
      const { body } = await request(httpServer)
        .post('/products')
        .send(product)
        .expect(HttpStatus.CREATED);

      // Validate all key in object are presents
      const testElement: Product = body;
      expect(testElement.id).not.toBeNull();
      expect(testElement).toMatchObject(product);
      expect(testElement.category).toBeNull();
    });

    it('must return 400 on not existing category', async () => {
      const createProduct = { ...product, categoryId: 999999 };

      await request(httpServer)
        .post('/products')
        .send(createProduct)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
