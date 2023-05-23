import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  // exports: [PaymentController],
})
export class PaymentModule {}
