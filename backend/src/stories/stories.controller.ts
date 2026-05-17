import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async getAllStories() {
    return this.storiesService.getAllStories();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createStory(@Request() req, @Body() body: any) {
    return this.storiesService.createStory(req.user.userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateStory(@Request() req, @Param('id', ParseIntPipe) storyId: number, @Body() body: any) {
    return this.storiesService.updateStory(req.user.userId, storyId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteStory(@Request() req, @Param('id', ParseIntPipe) storyId: number) {
    return this.storiesService.deleteStory(req.user.userId, storyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  async addComment(@Request() req, @Param('id', ParseIntPipe) storyId: number, @Body('content') content: string) {
    return this.storiesService.addComment(req.user.userId, storyId, content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/support')
  async toggleSupport(@Request() req, @Param('id', ParseIntPipe) storyId: number) {
    return this.storiesService.toggleSupport(req.user.userId, storyId);
  }
}
