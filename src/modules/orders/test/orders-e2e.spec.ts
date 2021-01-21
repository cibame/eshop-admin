/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestUtils } from '../../../../test/utils/test.util';
import {
  MailerProvider,
  SendMailOptions,
} from '../../../shared/mailer/mailer/mailer.provider';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order, OrderStatus, OrderType } from '../entities/order.entity';
import { OrdersModule } from '../orders.module';

describe('Orders Module', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let spy: jest.SpyInstance;

  beforeAll(async () => {
    app = await TestUtils.initializeApp([OrdersModule]);
    httpServer = app.getHttpServer();

    const mailerProvider = app.get(MailerProvider);
    spy = jest.spyOn(mailerProvider, 'send');
  });

  beforeEach(async () => {
    spy.mockClear();
    await TestUtils.reloadFixtures(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /orders API', () => {
    it('[NOT-AUTHENTICATED] must return all orders ', async () => {
      const { body } = await request(httpServer)
        .get('/orders')
        .expect(HttpStatus.OK);
      expect(body.length).toEqual(2);
      // Validate all key in object are presents
      const testElement: Order = body[1];
      expect(testElement.id).not.toBeNull();
      expect(testElement.total).toBe(20);
      expect(testElement.type).not.toBeNull();
      expect(testElement.status).not.toBeNull();
      expect(testElement.uuid).not.toBeNull();
      expect(testElement.products.length).toBe(1);
      expect(testElement.user).not.toBeNull();
    });
  });

  describe('POST /orders API', () => {
    const newOrder: CreateOrderDto = {
      note: 'note',
      type: OrderType.Delivery,
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
    const productName = 'Prodotto Test Ordine 1';

    it('[NOT-AUTHENTICATED] must create an order correctly ', async () => {
      const mailerProvider = app.get(MailerProvider);
      jest
        .spyOn(mailerProvider, 'send')
        .mockImplementation((option: SendMailOptions) => {
          return new Promise((resolve, _reject) => {
            resolve({});
          });
        });

      const { body } = await request(httpServer)
        .post('/orders')
        .send(newOrder)
        .expect(HttpStatus.CREATED);
      // Validate all key in object are presents
      const testElement: Order = body;
      expect(testElement.id).not.toBeNull();
      expect(testElement.note).toBe(newOrder.note);
      expect(testElement.type).toBe(newOrder.type);
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
      expect(testElement.products[0].name).toBe(productName);
      expect(testElement.total).toBe(30);
    });

    it('[NOT-AUTHENTICATED] must return 400 if one of the product does not exists ', (): request.Test => {
      const newOrder: CreateOrderDto = {
        note: 'note',
        type: OrderType.Delivery,
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

    it('[NOT-AUTHENTICATED] must send an email to user when order is placed', async () => {
      spy.mockImplementation((option: SendMailOptions) => {
        return new Promise((resolve, _reject) => {
          resolve({});
        });
      });

      await request(httpServer)
        .post('/orders')
        .send(newOrder)
        .expect(HttpStatus.CREATED);

      // TODO: Validate each parameter passed to the mail
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: newOrder.user.email,
          subject: 'Conferma del tuo ordine',
          template: 'order',
          params: expect.anything(),
        }),
      );
    });

    it('[NOT-AUTHENTICATED] must create an order in waiting-confirmation status ', async () => {
      const { body } = await request(httpServer)
        .post('/orders')
        .send(newOrder)
        .expect(HttpStatus.CREATED);
      // Validate all key in object are presents
      const testElement: Order = body;
      expect(testElement.id).toBeDefined();
      expect(testElement.status).toBe(OrderStatus.WaitingConfirmation);
    });

    it('[NOT-AUTHENTICATED] must create an UUID attached to the order', async () => {
      const { body } = await request(httpServer)
        .post('/orders')
        .send(newOrder)
        .expect(HttpStatus.CREATED);
      // Validate all key in object are presents
      const testElement: Order = body;
      expect(testElement.id).toBeDefined();
      expect(testElement.uuid).toBeDefined();
    });
  });

  describe('GET /orders/{uuid} API', () => {
    const orderUUID = 'UUID_TEST_ORDER_1';

    it('[NOT-AUTHENTICATED] must return the order for a correct UUID', async () => {
      const { body } = await request(httpServer)
        .get(`/orders/${orderUUID}`)
        .expect(HttpStatus.OK);

      const testElem: Order = body;
      expect(testElem.id).toBe(1);
    });

    it('[NOT-AUTHENTICATED] must return 404 if the UUID does not exists', (): request.Test => {
      return request(httpServer)
        .get('/orders/test')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
