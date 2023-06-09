import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { CacheModule } from '@nestjs/cache-manager'
import { AppService } from './app.service'
import { UploadModule } from './upload/upload.module'
import { PaymentModule } from './payment/payment.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { VideoModule } from './video/video.module'
import { SmsModule } from './sms/sms.module'
import { TalkModule } from './talk/talk.module'
import { CaptchaModule } from './captcha/captcha.module'
import { PostModule } from './post/post.module';
import { FriendModule } from './friend/friend.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: 1000 * 60, // 缓存有效期为60秒
      max: 1000, // 最多缓存1000条记录
      isGlobal: true,
    }),
    UploadModule,
    PaymentModule,
    AuthModule,
    PrismaModule,
    VideoModule,
    SmsModule,
    TalkModule,
    CaptchaModule,
    PostModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
