import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailerProvider } from '../../shared/mailer/mailer/mailer.provider';
import { ListQuery } from '../../shared/service/paginate/model/list-query.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDTo } from './dto/update-order-status.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderGuard } from './guard/order.guard';
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
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @UseGuards(OrderGuard)
  @ApiResponse({ type: Order })
  findOne(@Param('id') _: string, @Req() req): Promise<Order> {
    return req.order;
  }

  @Get('/uuid/:uuid')
  @ApiResponse({ type: Order })
  async findOneUUID(@Param('uuid') uuid: string) {
    const order = await this.ordersService.findOneUUID(uuid);
    if (!order) {
      throw new NotFoundException();
    }

    return order;
  }

  @Put(':id')
  @UseGuards(OrderGuard)
  @UsePipes(OrderProductPipe)
  @ApiResponse({ type: Order })
  editOne(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Post(':id/status')
  @HttpCode(200)
  @UseGuards(OrderGuard)
  async changeStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDTo,
  ) {
    await this.ordersService.updateStatus(+id, updateOrderStatusDto);
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
