import { PrismaService } from './../prisma/prisma.service'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService, private prisma: PrismaService) {
    super({
      //解析用户提交的Bearer Token header数据
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //加密码的 secret
      secretOrKey: configService.get('token_secrect'),
    })
  }

  //验证通过后结果用户资料
  async validate({ id }) {
    const info = this.prisma.user.findUnique({
      where: { id },
    })
    console.log(info)

    return info ?? { data: { message: '用户不存在', code: 1 } }
  }
}
