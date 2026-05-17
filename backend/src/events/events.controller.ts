import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createEvent(@Request() req, @Body() body: any) {
    return this.eventsService.createEvent(req.user.userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateEvent(@Request() req, @Param('id', ParseIntPipe) eventId: number, @Body() body: any) {
    return this.eventsService.updateEvent(req.user.userId, eventId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteEvent(@Request() req, @Param('id', ParseIntPipe) eventId: number) {
    return this.eventsService.deleteEvent(req.user.userId, eventId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/join')
  async joinEvent(@Request() req, @Param('id', ParseIntPipe) eventId: number) {
    return this.eventsService.joinEvent(req.user.userId, eventId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  async addComment(@Request() req, @Param('id', ParseIntPipe) eventId: number, @Body('content') content: string) {
    return this.eventsService.addComment(req.user.userId, eventId, content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/support')
  async toggleSupport(@Request() req, @Param('id', ParseIntPipe) eventId: number) {
    return this.eventsService.toggleSupport(req.user.userId, eventId);
  }
}
