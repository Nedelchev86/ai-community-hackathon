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

    // Mark messages as read when opening the chat
    await this.prisma.message.updateMany({
      where: {
        exchangeId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return this.prisma.message.findMany({
      where: { exchangeId },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findUnread(userId: number) {
    return this.prisma.message.findMany({
      where: {
        isRead: false,
        senderId: { not: userId },
        exchange: {
          OR: [
            { requesterId: userId },
            { donation: { userId: userId } },
          ],
        },
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
        exchange: {
          include: {
            donation: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
