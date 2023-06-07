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
        // comment: true,
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
    const { id, userId, zanCondition } = body
    const likeLists = await this.prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        likeList: true,
        disLikest: true,
      },
    })
    const alreadyLikeList = JSON.parse(likeLists.likeList) || []
    const alreadyDisLikeList = JSON.parse(likeLists.disLikest) || []
    if (zanCondition === 'like') {
      if (alreadyLikeList?.includes(userId)) {
        return { code: 1, message: '已经点过赞了' }
      } else {
        alreadyLikeList.push(userId)
        await this.prisma.post.update({
          where: {
            id,
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
            id,
          },
          data: {
            disLikest: JSON.stringify(alreadyDisLikeList),
          },
        })
        return { code: 0, message: '点踩成功' }
      }
    }
  }
  //评论
  async addComment(body: { [key: string]: any }) {
    const { userId, content, postId } = body
    try {
      await this.prisma.comment.create({
        data: {
          content,
          postId,
          userId,
        },
      })
      return { code: 0, message: '评论成功' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  //获取某条动态下的评论
  async getComment(id: number) {
    try {
      const result = await this.prisma.comment.findMany({
        where: {
          postId: id,
        },
        include: {
          user: true,
          reply: {
            include: {
              user: true,
              reply: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      })
      return result
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  //给某条评论点赞或者踩
  async addCommentZan(body: { [key: string]: any }) {
    const { id, userId, zanCondition } = body
    const likeLists = await this.prisma.comment.findUnique({
      where: {
        id,
      },
      select: {
        likeList: true,
        disLikest: true,
      },
    })
    const alreadyLikeList = JSON.parse(likeLists.likeList) || []
    const alreadyDisLikeList = JSON.parse(likeLists.disLikest) || []
    if (zanCondition === 'like') {
      if (alreadyLikeList?.includes(userId)) {
        return { code: 1, message: '已经点过赞了' }
      } else {
        alreadyLikeList.push(userId)
        await this.prisma.comment.update({
          where: {
            id,
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
        await this.prisma.comment.update({
          where: {
            id,
          },
          data: {
            disLikest: JSON.stringify(alreadyDisLikeList),
          },
        })
        return { code: 0, message: '点踩成功' }
      }
    }
  }
  //回复某条评论
  async replycomment(body: { [key: string]: never }) {
    const { userId, content, commentId } = body
    try {
      await this.prisma.reply.create({
        data: {
          replyContent: content,
          commentId,
          userId,
          replyId: body?.replyId,
        },
      })
      return { code: 0, message: '回复成功' }
    } catch (error) {
      console.log(error)

      throw new BadRequestException(error)
    }
  }
  //回复某条回复
  async replyReply(body: { [key: string]: any }) {
    const { userId, content, replyId } = body
    try {
      await this.prisma.reply.create({
        data: {
          replyContent: content,
          replyId,
          userId,
        },
      })
      return { code: 0, message: '回复成功' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
