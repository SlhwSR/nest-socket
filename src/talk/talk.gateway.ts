import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets'
import { TalkService } from './talk.service'
import { CreateTalkDto } from './dto/create-talk.dto'
import { UpdateTalkDto } from './dto/update-talk.dto'
import { Server, Socket } from 'socket.io'
import { PrismaService } from 'src/prisma/prisma.service'
import * as dayjs from 'dayjs'

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
}
