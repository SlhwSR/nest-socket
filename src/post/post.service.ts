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

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      await this.prisma.post.update({
        where: {
          id,
        },
        data: {
          title: updatePostDto.title,
          content: updatePostDto.content,
          covers: updatePostDto?.covers,
          userId: updatePostDto?.userId,
          categoryId: updatePostDto?.categoryId,
        },
      })
      return { code: 0, message: '更新成功' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.post.delete({
        where: {
          id,
        },
      })
      return {
        code: 0,
        message: '删除成功',
      }
    } catch (error) {
      console.log(error)

      throw new BadRequestException(error)
    }
  }
  // 根据用户id查找用户的所有文章
  async findUserPost(id: number) {
    try {
      const result = await this.prisma.post.findMany({
        where: {
          userId: id,
        },
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
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
