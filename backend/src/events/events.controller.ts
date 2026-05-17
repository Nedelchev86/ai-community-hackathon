import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
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
  @Post(':id/join')
  async joinEvent(@Request() req, @Param('id', ParseIntPipe) eventId: number) {
    return this.eventsService.joinEvent(req.user.userId, eventId);
  }
}

