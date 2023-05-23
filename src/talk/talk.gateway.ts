import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets'
import { TalkService } from './talk.service'
import { CreateTalkDto } from './dto/create-talk.dto'
import { UpdateTalkDto } from './dto/update-talk.dto'
import { Server } from 'http'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TalkGateway {
  constructor(private readonly talkService: TalkService) {}
  @WebSocketServer()
  server: Server
  @SubscribeMessage('createTalk')
  create(@MessageBody() createTalkDto: any, @ConnectedSocket() socket: any) {
    console.log(socket.id)
    return this.talkService.create(createTalkDto)
  }
  @SubscribeMessage('findAllTalk')
  findAll() {
    return this.talkService.findAll()
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
