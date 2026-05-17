import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Request() req, @Body() body: any) {
    return this.donationsService.create(req.user.userId, body);
  }

  @Get()
  async findAll() {
    return this.donationsService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async findMine(@Request() req) {
    return this.donationsService.findByUser(req.user.userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.donationsService.update(parseInt(id), req.user.userId, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Request() req) {
    return this.donationsService.remove(parseInt(id), req.user.userId);
  }
}
