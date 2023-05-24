import { Module } from '@nestjs/common'
import { TalkService } from './talk.service'
import { TalkGateway } from './talk.gateway'
import { TalkController } from './talk.controller'

@Module({
  controllers: [TalkController],
  providers: [TalkGateway, TalkService],
})
export class TalkModule {}
