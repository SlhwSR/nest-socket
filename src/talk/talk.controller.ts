import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PrismaService } from 'src/prisma/prisma.service'
@ApiTags('通知')
@Controller('message')
export class TalkController {
  constructor(private prisma: PrismaService) {}
  //创建订单
  //   @ApiOperation({ summary: '创建订单' })
  @Get()
  async createOrder() {
    const res = await this.prisma.message.findMany()
    return { data: res }
  }
  //支付订单
  //   @ApiOperation({ summary: '支付订单' })
  //   @Post('/:id/pay')
  //   payOrder(@Param() id: any, @Body() payOrderDto: any) {
  //     return '#'
  //   }
  //查询订单
  //退款订单
  //关闭订单
  //查询退款
  //下载对账单
  //交易保障
  //转换短链接
  //查询分账结果
}
