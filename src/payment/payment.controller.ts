import { Body, Controller, Param, Post } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
@ApiTags('支付')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  //创建订单
  @ApiOperation({ summary: '创建订单' })
  @Post('/create')
  createOrder(@Body() createOrderDto: { amount: number }) {
    return this.paymentService.createOrder(createOrderDto)
  }
  //支付订单
  @ApiOperation({ summary: '支付订单' })
  @Post('/:id/pay')
  payOrder(@Param() id: any, @Body() payOrderDto: any) {
    return this.paymentService.payOrder(id, payOrderDto)
  }
  //查询订单
  //退款订单
  //关闭订单
  //查询退款
  //下载对账单
  //交易保障
  //转换短链接
  //查询分账结果
}
