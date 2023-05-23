import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Ip } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { RegisterAuthDto } from './dto/register-auth.dto'
import { Auth } from './decorator/auth.decorator'
import { Role } from './enum/role'
@ApiTags('权限')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: '登陆' })
  @Post('/login')
  create(@Body() createAuthDto: CreateAuthDto, @Ip() ip: string) {
    return this.authService.login(createAuthDto, ip)
  }
  @ApiOperation({ summary: '注册' })
  @Post('/register')
  register(@Body() registerAuthDto: RegisterAuthDto, @Ip() ip: string) {
    return this.authService.register(registerAuthDto, ip)
  }
  @ApiOperation({ summary: '获取个人信息' })
  @Auth()
  @Get('/me')
  findPersonal(@Req() req: any) {
    return req.user
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id)
  }
  @Patch('/user/edit/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto)
  }
  @ApiOperation({ summary: '删除用户' })
  @Auth(Role.ADMIN)
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id)
  }
  @Auth(Role.ADMIN)
  @Get('/user/all')
  getAll(@Query() options) {
    return this.authService.findAll(options)
  }
  //修改用户信息
  @Auth()
  @Patch(`/update/userInfo/:id`)
  updateUserInfo(@Param('id') id: string, @Body() body: any) {
    return this.authService.updateUserInfo(+id, body)
  }
}
