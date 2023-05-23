import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import { IsExistsRule } from 'src/validate/is-exists.rule'

export class CreateAuthDto {
  @ApiProperty({ description: '用户名，邮箱' })
  @IsNotEmpty()
  @IsExistsRule('user', { message: '账号/邮箱不存在' })
  email: string
  @ApiProperty({ description: '密码' })
  @IsNotEmpty()
  @Length(6, 16, { message: '密码必须5位小于17位' })
  password: string
}
