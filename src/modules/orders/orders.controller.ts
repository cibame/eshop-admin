import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailerProvider } from '../../shared/mailer/mailer/mailer.provider';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
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

  @Post()
  @ApiCreatedResponse({ type: Order })
  @UsePipes(OrderProductPipe)
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    try {
      // TODO: e2e test this feature
      this.mailerProvider.send({
        to: createOrderDto.user.email,
        subject: 'Conferma del tuo ordine',
        template: 'order',
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

  @Get(':uuid')
  @ApiResponse({ type: Order })
  findOne(@Param('uuid') uuid: string) {
    const order = this.ordersService.findOne(uuid);
    if (!order) {
      throw new NotFoundException();
    }

    return order;
  }
}

export class HideOrder {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiResponse({ type: Order })
  findAll() {
    return this.ordersService.findAll();
  }

  //TODO: evaluate what can be changed for a single order
  //TODO: protect with a random generated token, the order (unauthenticated user)
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  //TODO: evaluate what type of deletion is admitted
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
