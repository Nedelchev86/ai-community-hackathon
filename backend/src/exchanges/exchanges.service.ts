import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExchangesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, donationId: number) {
    // Check if donation exists and is available
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
    });
    
    if (!donation) throw new NotFoundException('Donation not found');
    if (donation.userId === userId) throw new ForbiddenException('Cannot request your own donation');
    if (donation.status !== 'available') throw new ForbiddenException('Donation is not available');

    // Create exchange request
    return this.prisma.exchange.create({
      data: {
        donationId,
        requesterId: userId,
        status: 'pending',
      },
    });
  }

  async getMyRequests(userId: number) {
    return this.prisma.exchange.findMany({
      where: { requesterId: userId },
      include: {
        donation: {
          include: { user: { select: { id: true, name: true, email: true } } }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyReceivedRequests(userId: number) {
    return this.prisma.exchange.findMany({
      where: {
        donation: { userId },
      },
      include: {
        requester: { select: { id: true, name: true, email: true } },
        donation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptRequest(userId: number, exchangeId: number) {
    const exchange = await this.prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: { donation: true },
    });

    if (!exchange) throw new NotFoundException('Exchange not found');
    if (exchange.donation.userId !== userId) throw new ForbiddenException('Not authorized');

    // Update exchange and donation status
    await this.prisma.exchange.update({
      where: { id: exchangeId },
      data: { status: 'accepted' },
    });

    return this.prisma.donation.update({
      where: { id: exchange.donationId },
      data: { status: 'reserved' },
    });
  }

  async completeRequest(userId: number, exchangeId: number) {
    const exchange = await this.prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: { donation: true },
    });

    if (!exchange) throw new NotFoundException('Exchange not found');
    if (exchange.donation.userId !== userId && exchange.requesterId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    if (exchange.status !== 'accepted' && exchange.status !== 'completed') {
       throw new ForbiddenException('Exchange must be accepted first');
    }

    const isOwner = exchange.donation.userId === userId;
    const isRequester = exchange.requesterId === userId;

    const updatedData: any = {};
    if (isOwner) updatedData.ownerCompleted = true;
    if (isRequester) updatedData.requesterCompleted = true;

    // Check if both have completed now
    const willBeCompleted = 
      (isOwner ? true : exchange.ownerCompleted) && 
      (isRequester ? true : exchange.requesterCompleted);

    if (willBeCompleted) {
      updatedData.status = 'completed';
      await this.prisma.donation.update({
        where: { id: exchange.donationId },
        data: { status: 'completed' },
      });
    }

    return this.prisma.exchange.update({
      where: { id: exchangeId },
      data: updatedData,
    });
  }
}
