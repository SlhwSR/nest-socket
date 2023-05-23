import { Module } from '@nestjs/common';
import { TalkService } from './talk.service';
import { TalkGateway } from './talk.gateway';

@Module({
  providers: [TalkGateway, TalkService]
})
export class TalkModule {}
