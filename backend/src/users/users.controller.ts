import { Controller, Get, Patch, Body, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('recent')
  async getRecent(@Query('limit') limit: string) {
    return this.usersService.findRecent(limit ? parseInt(limit) : 5);
  }

  @Get('heroes')
  async getHeroes() {
    return this.usersService.findAllHeroes();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  updateProfile(@Request() req, @Body() body: any) {
    return this.usersService.update(req.user.userId, body);
  }
}
