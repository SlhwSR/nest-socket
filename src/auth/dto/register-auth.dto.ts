import { ApiProperty } from '@nestjs/swagger'
import { Allow, IsEmail, IsNotEmpty, Length } from 'class-validator'
import { IsConfirmRule } from 'src/validate/is-confirm.rule'
import { IsNotExistsRule } from 'src/validate/is-not-exists.rule'

export class RegisterAuthDto {
  @ApiProperty({ description: '用户名，邮箱' })
  @IsNotEmpty()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotExistsRule('user', { message: '账号/邮箱已存在' })
  email: string
  @ApiProperty({ description: '密码' })
  @IsNotEmpty()
  @Length(6, 16, { message: '密码必须5位小于17位' })
  @IsConfirmRule({ message: '两次输入密码不一致' })
  password: string
  @ApiProperty({ description: '确认密码' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  password_confirm: string
  @IsNotEmpty()
  @IsNotExistsRule('user', { message: '昵称已存在' })
  @Length(2, 13, { message: '昵称最低2个字最高三个字' })
  nickName: string

  @Allow()
  captchKey: string

  @IsNotEmpty({ message: '验证码不能为空' })
  captchCode: string
}
