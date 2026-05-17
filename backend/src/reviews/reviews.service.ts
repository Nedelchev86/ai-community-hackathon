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
}
