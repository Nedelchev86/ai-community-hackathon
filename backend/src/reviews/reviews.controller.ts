import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('stats')
  async getGlobalStats() {
    return this.reviewsService.getGlobalStats();
  }

  @Get('recent')
  async getRecentReviews(@Query('limit') limit: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.reviewsService.getRecentReviews(parsedLimit);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createReview(
    @Request() req,
    @Body()
    body: {
      exchangeId: number;
      rating: number;
      comment?: string;
      imageUrl?: string;
    },
  ) {
    return this.reviewsService.create(req.user.userId, body.exchangeId, body);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMyReviews(@Request() req) {
    return this.reviewsService.getMyReviews(req.user.userId);
  }
}
