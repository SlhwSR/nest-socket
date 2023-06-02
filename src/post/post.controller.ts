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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto)
  }
  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id)
  }
  //根据用户id查找post
  @Auth()
  @Get('user/:id')
  findUserPost(@Param('id') id: string) {
    return this.postService.findUserPost(+id)
  }
  //创建分类
  @Auth()
  @Post('category')
  createCategory(@Body() body: { [key: string]: any }) {
    return this.postService.createCategory(body)
  }
  //查找分类
  @Auth()
  @Get('category')
  findCategoryList() {
    return this.postService.findAllCategory()
  }
  @Auth()
  @Post('dianzan')
  addZan(@Body() body: { [key: string]: any }) {
    return this.postService.addZan(body)
  }
}
