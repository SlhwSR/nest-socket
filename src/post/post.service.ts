import { BadRequestException, Injectable } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PrismaService } from 'src/prisma/prisma.service'
@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto) {
    try {
      await this.prisma.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          userId: createPostDto.userId,
          covers: createPostDto?.covers,
          categoryId: createPostDto?.categoryId,
        },
      })
      return {
        code: 0,
        message: '创建成功',
      }
    } catch (error) {
      console.log(error)

      throw new BadRequestException(error)
    }
  }

  async findAll() {
    const result = await this.prisma.post.findMany({
      include: {
        user: true,
        comment: true,
        category: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    })
    return result
    //  await      return `This action returns all post`
  }

  findOne(id: number) {
    return `This action returns a #${id} post`
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`
  }

  remove(id: number) {
    return `This action removes a #${id} post`
  }
}
