import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { UploadService } from './upload.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { url } from 'src/utils/helper'
import { Image, Markdown, Video } from './decorator/upload.decorator'
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('image')
  @Image()
  // @Markdown('file', ['image', 'pdf'])
  // @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
    return {
      url: url(file.path),
    }
  }
  @Post('video')
  @Video()
  toUploadVidoe(@UploadedFile() file: Express.Multer.File) {
    return {
      url: url(file.path),
    }
  }
}
