import AdminBro, { ResourceWithOptions } from 'admin-bro';
import { Order } from '../modules/orders/entities/order.entity';

export const OrderResource: ResourceWithOptions = {
  resource: Order,
  options: {
    showProperties: [
      'userId',
      'note',
      'type',
      'status',
      'dateCreated',
      'total',
      'user',
      'products',
    ],
    listProperties: [
      'userId',
      'note',
      'type',
      'status',
      'dateCreated',
      'total',
      'user',
      'products',
    ],
    properties: {
      total: {
        components: {
          list: AdminBro.bundle('./components/order-total-component'),
        },
      },
      user: {
        components: {
          list: AdminBro.bundle('./components/order-user-component'),
          show: AdminBro.bundle('./components/order-user-component'),
        },
      },
      products: {
        isArray: true,
        components: {
          show: AdminBro.bundle('./components/order-product-component'),
          list: AdminBro.bundle('./components/order-product-component'),
        },
        reference: 'OrderProduct',
      },
    },
  },
};
