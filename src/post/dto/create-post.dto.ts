import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Length } from 'class-validator'

export class CreatePostDto {
  @IsString({ message: '标题必须是字符串' })
  @Length(1, 45, { message: '标题长度为1-45' })
  @IsNotEmpty({ message: '标题不能为空' })
  title: string
  @IsString()
  @Length(10, 10000, { message: '内容长度最少10个字且不大于10000字' })
  content: string
  @IsOptional()
  @IsNumber()
  categoryId?: number
  @IsOptional()
  @IsString()
  covers?: string
  @IsNumber()
  userId: number
}
