import {
  applyDecorators,
  Controller,
  MethodNotAllowedException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
export function fileFilter(type: string[]) {
  return (req: any, file: Express.Multer.File, callback) => {
    console.log(file.mimetype)
    const check = type.some((item) => file.mimetype.includes(item))
    if (!check) {
      callback(new MethodNotAllowedException('文件类型错误'), false)
    } else {
      callback(null, true)
    }
  }
}
export function Upload(field?: any, options?: MulterOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(field ? field : 'file', options)))
}
//-----根据返回装饰器定义各类文件类型
export function Image(file = 'file') {
  return Upload(file, {
    limits: { fileSize: Math.pow(1024, 2) * 10 },
    fileFilter: fileFilter(['image']),
  })
}
export function Document(file = 'file') {
  return Upload(file, {
    limits: { fileSize: Math.pow(1024, 2) * 10 },
    fileFilter: fileFilter(['pdf']),
  })
}
export function Markdown(file = 'file', type: string[] = ['pdf']) {
  return Upload(file, {
    limits: { fileSize: Math.pow(1024, 2) * 10 },
    fileFilter: fileFilter(type),
  })
}
export function Video(file = 'file') {
  return Upload(file, {
    limits: {
      fileSize: Math.pow(1024, 2) * 12,
    },
    fileFilter: fileFilter(['video', 'image']),
  })
}
