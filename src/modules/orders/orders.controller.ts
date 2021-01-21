import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailerProvider } from '../../shared/mailer/mailer/mailer.provider';
import { ListQuery } from '../../shared/service/paginate/model/list-query.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderPaginatedList } from './model/order-paginated-list';
import { OrderProductPipe } from './order-product.pipe';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly mailerProvider: MailerProvider,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiResponse({ type: Order })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('/paginated')
  @ApiResponse({ type: OrderPaginatedList })
  findPaginated(@Query() query: ListQuery): Promise<OrderPaginatedList> {
    console.log('here');
    return this.ordersService.findAll(query);
  }

  @Get(':uuid')
  @ApiResponse({ type: Order })
  async findOne(@Param('uuid') uuid: string) {
    const order = await this.ordersService.findOne(uuid);
    if (!order) {
      throw new NotFoundException();
    }

    return order;
  }

  @Post()
  @ApiCreatedResponse({ type: Order })
  @UsePipes(OrderProductPipe)
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);

    // // Send email to client
    try {
      // TODO: e2e test this feature
      this.mailerProvider.send({
        to: createOrderDto.user.email,
        subject: 'Conferma del tuo ordine',
        template: 'order',
        params: {
          order,
          ecommerce_order_url: 'http://ecommerce.zeroezero.eu/order',
        },
      });
    } catch (err) {
      //TODO: handle error better

      console.error(err);
    }

    // Send email to admin
    try {
      // TODO: e2e test this feature
      this.mailerProvider.send({
        to: this.configService.get<string>('SHOP_EMAIL'),
        subject: 'Nuovo ordine',
        template: 'order-admin',
        params: {
          order,
        },
      });
    } catch (err) {
      //TODO: handle error better
      console.error(err);
    }

    return order;
  }
}

export class HideOrder {
  constructor(private readonly ordersService: OrdersService) {}

  //TODO: evaluate what can be changed for a single order
  //TODO: protect with a random generated token, the order (unauthenticated user)
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }
}
