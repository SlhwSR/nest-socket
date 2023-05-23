import { Body, Controller, Post } from '@nestjs/common'
import { CodeDto } from './dto/Code.dto'
import { SmsService } from './sms.service'
import { ConfigService } from '@nestjs/config'
import { success } from 'src/utils/helper'

@Controller('sms')
export class SmsController {
  constructor(private codeService: SmsService, private config: ConfigService) {}
  @Post('send/mobile')
  async send(@Body() dto: CodeDto) {
    const code = await this.codeService.createCode()
    return success('验证码发送成功', this.config.get('is_dev') ? code : '')
  }
  @Post('send/qq')
  async sendQq(@Body() dto: { to: string; subject: string; text: string }) {
    return this.codeService.sendQq(dto)
  }
}
