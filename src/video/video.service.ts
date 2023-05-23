import { Injectable } from '@nestjs/common'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { PrismaService } from 'src/prisma/prisma.service'
@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}
  async create(createVideoDto: CreateVideoDto) {
    const result = await this.prisma.videoCategory.create({
      data: {
        title: createVideoDto.title,
        cover: createVideoDto.cover,
        description: createVideoDto.description,
        userId: createVideoDto.userId,
      },
    })
    return { data: { code: 0, message: '创建成功' } }
  }
  //查询用户个人所有视频
  async findPersonalAll(id: number, dto: any) {
    const result = await this.prisma.videoCategory.findMany({
      where: {
        userId: id,
      },
      skip: Number.isNaN(dto?.pageNum) ? 0 : (dto?.pageNum - 1) * dto?.pageSize,
      take: dto.pageSize,
    })
    const total = await this.prisma.videoCategory.count({
      where: {
        userId: id,
      },
    })
    return { data: { code: 0, message: '查询成功', data: result, total } }
  }
  async findAll(dto: any) {
    const result = await this.prisma.videoCategory.findMany({
      skip: Number.isNaN(+dto?.pageNum) ? 0 : (dto?.pageNum - 1) * dto?.pageSize,
      take: Number.isNaN(+dto?.pageSize) ? 100000 : +dto?.pageSize,
    })
    const total = await this.prisma.videoCategory.count()
    return { data: { code: 0, message: '查询成功', data: result, total } }
  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    const result = await this.prisma.videoCategory.update({
      where: {
        id,
      },
      data: {
        title: updateVideoDto.title,
        cover: updateVideoDto.cover,
        description: updateVideoDto.description,
        userId: updateVideoDto.userId,
      },
    })
    return { data: { code: 0, message: '更新成功' } }
  }
  async remove(id: number) {
    const result = await this.prisma.videoCategory.delete({
      where: {
        id,
      },
    })
    return { data: { code: 0, message: '删除成功' } }
  }
  async createVideo(dto: any) {
    const result = await this.prisma.video.create({
      data: {
        title: dto.title,
        cover: dto.cover,
        description: dto.description,
        videoUrl: dto.videoUrl,
        videoCategoryId: dto.videoCategoryId,
      },
    })
    return { data: { code: 0, message: '创建成功' } }
  }
  async deleteVideo(id: number) {
    const result = await this.prisma.video.delete({
      where: {
        id,
      },
    })
    return { data: { code: 0, message: '删除成功' } }
  }
  async updateVideo(dto: any) {
    const result = await this.prisma.video.update({
      where: {
        id: dto.id,
      },
      data: {
        title: dto.title,
        cover: dto.cover,
        description: dto.description,
        videoUrl: dto.videoUrl,
        videoCategoryId: dto.videoCategoryId,
      },
    })
    return { data: { code: 0, message: '更新成功' } }
  }
  //管理video列表
  async findAllVideo(dto: any) {
    const result = await this.prisma.video.findMany({
      skip: Number.isNaN(+dto?.pageNum) ? 0 : (dto?.pageNum - 1) * dto?.pageSize,
      take: Number.isNaN(+dto?.pageSize) ? 100000 : +dto?.pageSize,
    })
    const total = await this.prisma.video.count()
    return { data: { code: 0, message: '查询成功', data: result, total } }
  }
  //用户个人视频列表
  async findPersonalAllVideo(id: number, dto: any, categoryID: number) {
    const result = await this.prisma.user.findMany({
      where: {
        id,
      },
      include: {
        video: true,
      },
      skip: dto.pageNum,
      take: dto.pageSize,
    })
    const total = await this.prisma.video.count({
      where: {
        videoCategoryId: categoryID,
      },
    })
    return { data: { code: 0, message: '查询成功', data: result, total } }
  }
}
