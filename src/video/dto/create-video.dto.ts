import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateVideoDto {
  @IsNotEmpty({ message: '标题不能为空' })
  title: string
  @IsNotEmpty({ message: '封面不能为空' })
  cover: string
  @IsOptional()
  description?: string
  @IsNotEmpty({ message: '用户id不能为空' })
  userId: number
}
