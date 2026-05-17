import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() body: { exchangeId: number; content: string }) {
    return this.messagesService.create(req.user.userId, body.exchangeId, body.content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':exchangeId')
  async findByExchange(@Request() req, @Param('exchangeId') exchangeId: string) {
    return this.messagesService.findByExchange(req.user.userId, parseInt(exchangeId));
  }
}
