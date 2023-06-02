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

  //创建分类
  async createCategory(body: { [key: string]: any }) {
    try {
      await this.prisma.category.create({
        data: {
          name: body?.name,
          userId: body?.userId,
        },
      })
      return {
        code: 0,
        message: '创建成功',
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  //获取分类
  async findAllCategory() {
    try {
      console.log('进不来？')
      const result = await this.prisma.category.findMany()
      return result
    } catch (error) {
      console.log('进哪里了？')
      console.log(error)
      throw new BadRequestException(error)
    }
  }
  //给文章点赞或者踩
  async addZan(body: { [key: string]: any }) {
    const { postId, userId, zanCondition } = body
    const likeLists = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likeList: true,
        disLikest: true,
      },
    })
    const alreadyLikeList = JSON.parse(likeLists.likeList)
    const alreadyDisLikeList = JSON.parse(likeLists.disLikest)
    if (zanCondition === 'like') {
      if (alreadyLikeList.includes(userId)) {
        return { code: 1, message: '已经点过赞了' }
      } else {
        alreadyLikeList.push(userId)
        await this.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            likeList: JSON.stringify(alreadyLikeList),
          },
        })
        return { code: 0, message: '点赞成功' }
      }
    } else {
      if (alreadyDisLikeList.includes(userId)) {
        return { code: 1, message: '已经点过踩了' }
      } else {
        alreadyDisLikeList.push(userId)
        await this.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            disLikest: JSON.stringify(alreadyDisLikeList),
          },
        })
        return { code: 0, message: '点踩成功' }
      }
    }
  }
}
