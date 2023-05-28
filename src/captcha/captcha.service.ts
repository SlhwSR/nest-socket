import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { now } from 'lodash'
import * as Captcha from 'svg-captcha'
@Injectable()
export class CaptchaService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager) {}
  getSvg(ip: string) {
    const captcha = Captcha.createMathExpr({
      mathMin: 0,
      mathMax: 9,
      color: true,
      noise: 3,
    })
    const newKey = now() + ip
    this.cacheManager.set(newKey, captcha.text)
    console.log(captcha.text)
    console.log(captcha.data)
    return {
      key: newKey,
      data: captcha.data,
    }
  }
  async verify(key: string, value: string) {
    const saveValue = await this.cacheManager.get(key)
    console.log('存在的value' + saveValue)
    console.log(value)

    return saveValue === value
  }
}
