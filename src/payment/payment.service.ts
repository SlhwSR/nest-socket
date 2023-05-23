import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

@Injectable()
export class PaymentService {
  constructor(private config: ConfigService) {}
  //创建订单
  async createOrder(dto) {
    const paypal = new Stripe(this.config.get('STRIPE_SECRET'), {
      stripeAccount: this.config.get('STRIPE_ACCOUNT'),
      apiVersion: '2022-11-15',
    })
    const paymentintnet = await paypal.paymentIntents.create({
      amount: dto.amount,
      payment_method_types: ['wechat_pay', 'alipay'],
      currency: 'cny',
    })
    return paymentintnet
    // return 'This action adds a new payment'
  }
  //支付订单
  async payOrder(data: any, dto) {
    const paypal = new Stripe(this.config.get('STRIPE_SECRET'), {
      stripeAccount: this.config.get('STRIPE_ACCOUNT'),
      apiVersion: '2022-11-15',
    })
    const paymentintnet = await paypal.paymentIntents.confirm(data.id, {
      payment_method: dto.payment_method,
      payment_method_options: {
        wechat_pay: {
          client: 'web',
        },
      },
    })
    // const paymentintnet = paypal.checkout.sessions.create({
    //   payment_method_types: ['wechat_pay', 'alipay'],
    //   payment_method_options: {
    //     wechat_pay: {
    //       client: 'web',
    //     },
    //   },
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'cny',
    //         product_data: {
    //           name: 'Msn联名T恤',
    //         },
    //         unit_amount: 120,
    //       },
    //       quantity: 12,
    //       // price: '120  ',
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: 'http://localhost:5173',
    //   cancel_url: 'http://localhost:3000',
    // })
    console.log(paymentintnet)
    //展示paymentintnet的参数
    return paymentintnet
  }
}
