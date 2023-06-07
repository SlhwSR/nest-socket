import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets'
import { TalkService } from './talk.service'
import { CreateTalkDto } from './dto/create-talk.dto'
import { UpdateTalkDto } from './dto/update-talk.dto'
import { Server, Socket } from 'socket.io'
import { PrismaService } from 'src/prisma/prisma.service'
import * as dayjs from 'dayjs'
import { BadRequestException } from '@nestjs/common'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TalkGateway {
  constructor(private readonly talkService: TalkService, private prisma: PrismaService) {}
  @WebSocketServer()
  server: Server
  // socket连接钩子
  async handleConnection(client: Socket): Promise<string> {
    const userRoom = client.handshake.query.userId
    console.log(userRoom)

    if (userRoom) {
      client.join(userRoom)
    }
    return '连接成功'
  }

  // socket断连钩子
  async handleDisconnect(): Promise<any> {
    // this.getActiveGroupUser()
  }
  @SubscribeMessage('createTalk')
  create(@MessageBody() createTalkDto: any, @ConnectedSocket() socket: any) {
    return this.talkService.create(createTalkDto)
  }
  @SubscribeMessage('send')
  async send(
    @MessageBody() message: { content: string; avatar: string; userId: number; sender: string },
    @ConnectedSocket() socket: any,
  ) {
    console.log('server received:', message)
    //广播给所有人
    // this.server. broadcast.emit('message', message)
    const connt = await this.prisma.message.count()
    this.server.volatile.emit('message', {
      userId: message.userId,
      sender: message.sender,
      content: message.content,
      avatar: message.avatar,
    })
    const create = await this.prisma.message.create({
      data: {
        content: message.content,
        avatar: message.avatar,
        userId: message.userId,
        sender: message.sender,
      },
    })
    const res = await this.prisma.message.findMany()
    console.log(res)
    return create
  }
  @SubscribeMessage('join')
  join(@MessageBody() room: any, @ConnectedSocket() socket: any) {
    this.server.volatile.emit('join', {
      content: room?.email + '加入了会话',
      avatar: room?.avatar,
      userId: room?.id,
      sender: '系统通知',
    })

    return room
  }
  @SubscribeMessage('findAllTalk')
  findAll() {
    return this.talkService.findAll()
  }
  @SubscribeMessage('leave')
  async leave(@MessageBody() room: any, @ConnectedSocket() socket: any) {
    console.log(room)
    await this.prisma.message.create({
      data: {
        content: room?.email + '离开了会话',
        avatar: room?.avatar,
        userId: room?.id,
        sender: '系统通知',
      },
    })
    this.server.volatile.emit('leave', {
      content: room?.email + '离开了会话',
      avatar: room?.avatar,
      userId: room?.id,
      sender: '系统通知',
    })
    return room
  }
  @SubscribeMessage('findOneTalk')
  findOne(@MessageBody() id: number) {
    return this.talkService.findOne(id)
  }
  @SubscribeMessage('updateTalk')
  update(@MessageBody() updateTalkDto: UpdateTalkDto) {
    return this.talkService.update(updateTalkDto.id, updateTalkDto)
  }

  @SubscribeMessage('removeTalk')
  remove(@MessageBody() id: number) {
    return this.talkService.remove(id)
  }

  //发送好友申请
  @SubscribeMessage('sendFriend')
  async sendFriend(@MessageBody() data: any, @ConnectedSocket() socket: any) {
    const { userId, friendId } = data
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          friends: true,
        },
      })
      const friend = await this.prisma.user.findUnique({
        where: {
          id: friendId,
        },
        include: {
          friends: true,
        },
      })
      if (user.friends.find((item) => item.id === friendId)) {
        return { code: 1, message: '已经是好友了' }
      }
      if (friend.friends.find((item) => item.id === userId)) {
        return { code: 1, message: '已经是好友了' }
      }
      return { code: 0, message: '发送成功' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  //拒绝好友
  @SubscribeMessage('refuseFriend')
  async refuseFriend(@MessageBody() data: any, @ConnectedSocket() socket: any) {
    const { userId, friendId } = data
    try {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            friends: {
              disconnect: {
                id: friendId,
              },
            },
          },
        }),
        this.prisma.user.update({
          where: {
            id: friendId,
          },
          data: {
            friends: {
              disconnect: {
                id: userId,
              },
            },
          },
        }),
      ])
      return { code: 0, message: '拒绝成功' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  //同意好友
  @SubscribeMessage('agreeFriend')
  async agreeFriend(@MessageBody() data: any, @ConnectedSocket() socket: any) {
    const { userId, friendId } = data
    try {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            friends: {
              connect: {
                id: friendId,
              },
            },
          },
        }),
        this.prisma.user.update({
          where: {
            id: friendId,
          },
          data: {
            friends: {
              connect: {
                id: userId,
              },
            },
          },
        }),
      ])
      return { code: 0, message: '添加成功' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
