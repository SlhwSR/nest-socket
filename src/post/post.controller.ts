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
  //点赞或者踩
  @Auth()
  @Post('dianzan')
  addZan(@Body() body: { [key: string]: any }) {
    return this.postService.addZan(body)
  }
  //评论
  @Auth()
  @Post('comment')
  addComment(@Body() body: { [key: string]: any }) {
    return this.postService.addComment(body)
  }
  //获取某条post的评论
  @Auth()
  @Get('comment/:id')
  getComment(@Param('id') id: string) {
    return this.postService.getComment(+id)
  }
  //给某条评论点赞或者踩
  @Auth()
  @Post('comment/likeOrDislike')
  likeOrDislike(@Body() body: { [key: string]: any }) {
    return this.postService.addCommentZan(body)
  }
  //给某条评论回复
  @Auth()
  @Post('comment/reply')
  replyComment(@Body() body: { [key: string]: never }) {
    return this.postService.replycomment(body)
  }
}
