import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { PostService } from './post.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Auth } from 'src/auth/decorator/auth.decorator'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Auth()
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto)
  }
  @Auth()
  @Get()
  findAll() {
    return this.postService.findAll()
  }
  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto)
  }
  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id)
  }

  @Auth()
  @Get('user/:id')
  findUserPost(@Param('id') id: string) {
    return this.postService.findUserPost(+id)
  }
}
