import { Controller, Get, Ip } from '@nestjs/common'
import { CaptchaService } from './captcha.service'

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get()
  findAll(@Ip() ip:string) {
    return this.captchaService.getSvg(ip)
  }
}
