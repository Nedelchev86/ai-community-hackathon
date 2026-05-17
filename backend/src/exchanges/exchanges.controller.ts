import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createRequest(@Request() req, @Body('donationId') donationId: number) {
    return this.exchangesService.create(req.user.userId, donationId);
  }

  @Get('my-requests')
  @UseGuards(AuthGuard('jwt'))
  async getMyRequests(@Request() req) {
    return this.exchangesService.getMyRequests(req.user.userId);
  }

  @Get('received-requests')
  @UseGuards(AuthGuard('jwt'))
  async getReceivedRequests(@Request() req) {
    return this.exchangesService.getMyReceivedRequests(req.user.userId);
  }

  @Patch(':id/accept')
  @UseGuards(AuthGuard('jwt'))
  async acceptRequest(@Request() req, @Param('id') id: string) {
    return this.exchangesService.acceptRequest(req.user.userId, parseInt(id));
  }

  @Patch(':id/complete')
  @UseGuards(AuthGuard('jwt'))
  async completeRequest(@Request() req, @Param('id') id: string) {
    return this.exchangesService.completeRequest(req.user.userId, parseInt(id));
  }
}
