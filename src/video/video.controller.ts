import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { VideoService } from './video.service'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { Auth } from 'src/auth/decorator/auth.decorator'
@Auth()
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('/category')
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto)
  }

  @Get('/category')
  findAll(@Query() dto: any) {
    return this.videoService.findAll(dto)
  }

  @Get('/category/:id')
  findOne(@Param('id') id: string, @Query() dto: any) {
    return this.videoService.findPersonalAll(+id, dto)
  }

  @Patch('/category/:id')
  update(@Param('id') id: string, @Body() updateVideoDto: any) {
    return this.videoService.update(+id, updateVideoDto)
  }

  @Delete('/category/:id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id)
  }
  @Post('')
  createVideo(@Body() createVideoDto: any) {
    return this.videoService.createVideo(createVideoDto)
  }
  @Delete(':id')
  deleteVideo(@Param('id') id: string) {
    return this.videoService.deleteVideo(+id)
  }
  @Patch('')
  updateVideo(@Body() updateVideoDto: any) {
    return this.videoService.updateVideo(updateVideoDto)
  }
  @Get('')
  findVideo(@Query() dto: any) {
    return this.videoService.findAllVideo(dto)
  }
}
