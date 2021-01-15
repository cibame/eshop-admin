import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestUtils } from '../../../../test/utils/test.util';
import { CategoriesModule } from '../categories.module';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

describe('Categories Module', () => {
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
    it('[NOT-AUTHENTICATED] must return all categories ', async () => {
      const { body } = await request(httpServer)
        .get('/categories')
        .expect(HttpStatus.OK);
      expect(body.length).toEqual(2);
      // Validate all key in object are presents
      const testElement: Category = body[0];
      expect(testElement.id).not.toBeNull();
      expect(testElement.name).toBe('dolci');
      expect(testElement.description).not.toBeNull();
    });
  });

  describe('GET /categories/:id API', () => {
    it('[NOT-AUTHENTICATED] must return an existing category ', async () => {
      const testId = 1;
      const { body } = await request(httpServer)
        .get(`/categories/${testId}`)
        .expect(HttpStatus.OK);

      // Validate all key in object are presents
      const testElement: Category = body;
      expect(testElement.id).toBe(testId);
    });

    it('must return 404 on not existing category', async () => {
      await request(httpServer)
        .get('/categories/999')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /categories API', () => {
    const category: CreateCategoryDto = {
      name: 'Nuova categoria',
      description: 'test nuova categoria',
    };

    it('must create a category', async () => {
      const { body } = await request(httpServer)
        .post('/categories')
        .send(category)
        .expect(HttpStatus.CREATED);

      // Validate all key in object are presents
      const testElement: Category = body;
      expect(testElement.id).not.toBeNull();
      expect(testElement).toMatchObject(category);
    });
  });

  describe('PUT /categories API', () => {
    const category: UpdateCategoryDto = {
      name: 'test edited',
      description: 'test category edited',
    };

    it('must edit a category', async () => {
      const { body } = await request(httpServer)
        .put('/categories/1')
        .send(category)
        .expect(HttpStatus.OK);

      // Validate all key in object are presents
      const testElement: Category = body;
      expect(testElement.id).not.toBeNull();
      expect(testElement).toMatchObject(category);
      expect(testElement.id).toBe(1);
    });

    it('must return 404 on not existing category', async () => {
      await request(httpServer)
        .put('/categories/999')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /category API', () => {
    it('must delete a category', async () => {
      await request(httpServer)
        .delete('/categories/1')
        .expect(HttpStatus.OK);

      const { body } = await request(httpServer)
        .get('/categories')
        .expect(HttpStatus.OK);
      expect(body.length).toEqual(1);
    });

    it('must return 404 on not existing category', async () => {
      await request(httpServer)
        .delete('/categories/999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('must remove the category from related products', async () => {
      await request(httpServer)
        .delete('/categories/1')
        .expect(HttpStatus.OK);

      const { body } = await request(httpServer)
        .get('/products/1')
        .expect(HttpStatus.OK);
      expect(body.category).toBeNull();
    });
  });
});
