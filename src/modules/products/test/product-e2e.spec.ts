import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestUtils } from '../../../../test/utils/test.util';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
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

  describe('PUT /products API', () => {
    const product: UpdateProductDto = {
      name: 'test edited',
      description: 'test product edited',
      ingredients: 'three spoon of sugar edited',
      price: 10,
    };

    it('must edit a product', async () => {
      const { body } = await request(httpServer)
        .put('/products/1')
        .send(product)
        .expect(HttpStatus.OK);

      // Validate all key in object are presents
      const testElement: Product = body;
      expect(testElement.id).not.toBeNull();
      expect(testElement).toMatchObject(product);
      expect(testElement.category.id).toBe(1);
    });

    it('must edit category associated with a product', async () => {
      const editProduct = { ...product, categoryId: 2 };
      const { body } = await request(httpServer)
        .put('/products/1')
        .send(editProduct)
        .expect(HttpStatus.OK);

      // Validate all key in object are presents
      const testElement: Product = body;
      expect(testElement.category.id).toBe(2);
    });

    it('must remove category associated with a product', async () => {
      const editProduct = { ...product, categoryId: null };
      const { body } = await request(httpServer)
        .put('/products/1')
        .send(editProduct)
        .expect(HttpStatus.OK);

      // Validate all key in object are presents
      const testElement: Product = body;
      expect(testElement.category).toBeNull();
    });

    it('must return 400 on not existing category', async () => {
      const editProduct = { ...product, categoryId: 999999 };

      await request(httpServer)
        .put('/products/1')
        .send(editProduct)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('must return 404 on not existing product', async () => {
      await request(httpServer)
        .put('/products/999')
        .send(product)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
