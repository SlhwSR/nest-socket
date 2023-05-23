import { HttpException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { RegisterAuthDto } from './dto/register-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { hash, verify } from 'argon2'
@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private readonly PrismaService: PrismaService) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth'
  }
  async login(loginDto: CreateAuthDto, ip) {
    const user = await this.PrismaService.user.findUnique({
      where: { email: loginDto.email },
    })
    if (!user) {
      throw new HttpException('用户不存在', 400)
    }
    if (!(await verify(user.password, loginDto.password))) {
      throw new HttpException('密码错误', 400)
    }
    await this.PrismaService.user.update({
      where: { email: loginDto.email },
      data: {
        ip,
      },
    })
    return this.token(user)
  }
  async register(dto: RegisterAuthDto, ip: string) {
    //校验验证码
    // await this.codeService.check(dto)
    if (dto.email === '481628594@qq.com') {
      const user = await this.PrismaService.user.create({
        data: {
          email: dto.email,
          avatar: 'https://picsum.photos/200/300',
          nickName: 'adminUser',
          password: await hash(dto.password),
          role: 'admin',
          ip,
        },
      })
      return this.token(user)
    } else {
      const user = await this.PrismaService.user.create({
        data: {
          email: dto.email,
          avatar: 'https://picsum.photos/200/300',
          nickName: '友友',
          password: await hash(dto.password),
          ip,
        },
      })
      return this.token(user)
    }
  }
  async findAll(options) {
    const result = await this.PrismaService.user.findMany({
      skip: (options?.current - 1) * 10,
      take: options?.pageSize * 1,
    })
    const total = await this.PrismaService.user.count()
    return { data: { total, result } }
  }
  async token({ id }) {
    return {
      token: await this.jwt.signAsync({
        id,
      }),
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} auth`
  }
  async update(id: number, updateAuthDto) {
    const updateModel = await this.PrismaService.user.update({
      where: {
        id,
      },
      data: updateAuthDto,
    })
    return { data: { message: '更新成功', code: 0 } }
  }
  async remove(id: number) {
    await this.PrismaService.user.delete({
      where: {
        id,
      },
    })
    return { data: { code: 0, message: '删除成功！' } }
  }
  async updateUserInfo(id: number, dto: any) {
    const updateModel = await this.PrismaService.user.update({
      where: {
        id,
      },
      data: dto,
    })
    return { data: { message: '更新成功', code: 0, info: updateModel } }
  }
}
