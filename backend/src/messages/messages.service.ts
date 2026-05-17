import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, exchangeId: number, content: string) {
    const exchange = await this.prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: { donation: true },
    });

    if (!exchange) throw new NotFoundException('Exchange not found');

    // Only requester or donation owner can send messages
    if (exchange.requesterId !== userId && exchange.donation.userId !== userId) {
      throw new ForbiddenException('Not authorized to chat in this exchange');
    }

    return this.prisma.message.create({
      data: {
        content,
        senderId: userId,
        exchangeId,
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async findByExchange(userId: number, exchangeId: number) {
    const exchange = await this.prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: { donation: true },
    });

    if (!exchange) throw new NotFoundException('Exchange not found');

    if (exchange.requesterId !== userId && exchange.donation.userId !== userId) {
      throw new ForbiddenException('Not authorized to view this chat');
    }

    return this.prisma.message.findMany({
      where: { exchangeId },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
