import { PartialType } from '@nestjs/mapped-types'
import { CreateAuthDto } from './create-auth.dto'
import { IsOptional } from 'class-validator'

export class UpdateAuthDto {
  @IsOptional()
  nickName: string
  @IsOptional()
  avatar: string
  @IsOptional()
  personalSign: string
  @IsOptional()
  blackRole: string
}
