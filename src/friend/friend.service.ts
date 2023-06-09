import { Injectable } from '@nestjs/common'
import { CreateFriendDto } from './dto/create-friend.dto'
import { UpdateFriendDto } from './dto/update-friend.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}
  create(createFriendDto: CreateFriendDto) {
    return 'This action adds a new friend'
  }
  //查询所有用户
  async findAll() {
    return await this.prisma.user.findMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`
  }

  remove(id: number) {
    return `This action removes a #${id} friend`
  }
  search(body: any) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            email: body.email,
          },
          {
            nickName: body.nickName,
          },
        ],
      },
    })
  }
}
