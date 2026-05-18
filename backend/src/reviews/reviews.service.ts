import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    exchangeId: number,
    data: { rating: number; comment?: string; imageUrl?: string },
  ) {
    const exchange = await this.prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: { donation: true },
    });

    if (!exchange) throw new NotFoundException('Exchange not found');
    if (exchange.status !== 'completed')
      throw new BadRequestException(
        'Exchange must be completed to leave a review',
      );

    // Determine reviewee based on who is leaving the review
    let revieweeId: number;
    if (exchange.donation.userId === userId) {
      revieweeId = exchange.requesterId;
    } else if (exchange.requesterId === userId) {
      revieweeId = exchange.donation.userId;
    } else {
      throw new ForbiddenException('You are not part of this exchange');
    }

    // Check if review already exists
    const existing = await this.prisma.review.findFirst({
      where: { exchangeId, reviewerId: userId },
    });
    if (existing)
      throw new BadRequestException('You have already reviewed this exchange');

    return this.prisma.review.create({
      data: {
        exchangeId,
        reviewerId: userId,
        revieweeId,
        rating: data.rating,
        comment: data.comment,
        imageUrl: data.imageUrl,
      },
    });
  }

  async getMyReviews(userId: number) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { id: true, name: true } },
        exchange: { include: { donation: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getGlobalStats() {
    const completedExchanges = await this.prisma.exchange.count({
      where: { status: 'completed' },
    });
    const availableDonations = await this.prisma.donation.count({
      where: { status: 'available' },
    });
    
    const aggregations = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    });

    return {
      donated: completedExchanges,
      pending: availableDonations,
      averageRating: aggregations._avg.rating || 0,
    };
  }

  async getRecentReviews(limit = 10) {
    return this.prisma.review.findMany({
      take: limit,
      where: { 
        comment: { not: null },
        NOT: { comment: '' }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
        reviewee: { select: { id: true, name: true, avatarUrl: true } },
        exchange: {
          include: { donation: { select: { title: true, category: true, userId: true } } },
        },
      },
    });
  }
}
