import { ForbiddenException, Injectable } from '@nestjs/common'
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525'
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import * as $OpenApi from '@alicloud/openapi-client'
import Util, * as $Util from '@alicloud/tea-util'
import * as $tea from '@alicloud/tea-typescript'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import * as randomstring from 'randomstring'
import { Cache } from 'cache-manager'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash, verify } from 'argon2'

@Injectable()
export class SmsService {
  private transporter: nodemailer.Transporter
  private cache: Cache
  constructor(private config: ConfigService, private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'qq',
      auth: {
        user: this.config.get('QQ_ACCOUNT'),
        pass: this.config.get('QQ_AUTH_CODE'),
      },
      pool: true,
    })
  }
  createClient(accessKeyId: string, accessKeySecret: string): Dysmsapi20170525 {
    const config = new $OpenApi.Config({
      // 必填，您的 AccessKey ID
      accessKeyId: accessKeyId,
      // 必填，您的 AccessKey Secret
      accessKeySecret: accessKeySecret,
    })
    // 访问的域名
    config.endpoint = `dysmsapi.aliyuncs.com`
    return new Dysmsapi20170525(config)
  }
  // static async main(args: string[]): Promise<void> {
  //   // 工程代码泄露可能会导致AccessKey泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html
  //   const client = SmsService.createClient('accessKeyId', 'accessKeySecret')
  //   const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
  //     phoneNumbers: '18884678260',
  //     signName: '',
  //     templateCode: '测试专用',
  //   })
  //   const runtime = new $Util.RuntimeOptions({})
  //   try {
  //     // 复制代码运行请自行打印 API 的返回值
  //     await client.sendSmsWithOptions(sendSmsRequest, runtime)
  //   } catch (error) {
  //     // 如有需要，请打印 error
  //     Util.assertAsString(error.message)
  //   }
  // }
  async send(
    signName: string,
    templateCode: string,
    phoneNumbers: any,
    templateParam: Record<string, any>,
  ): Promise<void> {
    const client = this.createClient('12414145', 'asijfosiajfisajfisaj')
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      signName,
      templateCode,
      phoneNumbers,
      templateParam: JSON.stringify(templateParam),
    })
    const runtime = new $Util.RuntimeOptions({})
    // 复制代码运行请自行打印 API 的返回值
    const r = await client.sendSmsWithOptions(sendSmsRequest, runtime)
    if (r.body.code != 'OK') throw new ForbiddenException()
  }

  /**
   * 发送短信验证码
   * @param phoneNumbers 手机号
   * @returns
   */
  // async code(phoneNumbers: any) {
  //   const code = this.createCode()
  //   await this.send(this.aliyunConfig.sms_sign, this.aliyunConfig.sms_code_template, phoneNumbers, {
  //     code,
  //     product: this.aliyunConfig.sms_sign,
  //   })

  //   // await this.cacheService.set('H' + phoneNumbers, code, { ttl: 600 })
  //   return code
  // }

  /**
   * 生成随机验证码
   * @param phoneNumbers 手机号
   * @returns
   */
  createCode() {
    const code = Math.ceil(Math.random() * 8888) + 1000
    return code
  }
  //qq发邮件
  async sendQq(dto: { to: string; subject: string; text: string }) {
    await this.transporter.sendMail({
      from: '481628594@qq.com',
      to: dto.to,
      subject: dto.subject,
      text: dto.text,
    })
    return { data: { code: 0, message: '发送成功!' } }
  }
  //找回密码=>发送验证码操作
  async sendVerificationCode(email: string) {
    const code = randomstring.generate({
      length: 6,
      charset: 'numeric',
    })
    const validUntil = new Date(Date.now() + 3 * 60 * 1000) // 有效期为3分钟
    await this.cache.set(`verification-code:${email}`, code, 3 * 60) // 将验证码保存到缓存中，有效期为3分钟
    const mailOptions = {
      from: this.config.get('QQ_ACCOUNT'),
      to: email,
      subject: '重置密码',
      text: `您的验证码是：${code}。验证码有效期为3分钟。`,
    }
    await this.transporter.sendMail(mailOptions)
    return { data: { code: 0, message: '发送成功请注意查收' } }
  }
  //找回密码=>验证验证码操作
  async verifyCode(email: string, code: string) {
    const key = `verification-code:${email}`
    const cacheCode = await this.cache?.get(key)
    if (cacheCode !== code) {
      return { data: { code: 1, message: '验证码错误' } }
    }
    await this.cache.del(key)
    return { data: { code: 0, message: '验证成功' } }
  }
  //找回密码=>重置密码操作
  async resetPassword(email: string, password: string, confirmPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (!user) {
      return { data: { code: 1, message: '用户不存在' } }
    }
    if (password !== confirmPassword) {
      return { data: { code: 1, message: '两次密码不一致' } }
    }
    user.password = password
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: await hash(password),
      },
    })
    return { data: { code: 0, message: '重置密码成功' } }
  }
}
// SmsService.main(process.argv.slice(2))
