import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    return this.prisma.donation.create({
      data: {
        type: data.type || 'donation',
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl,
        city: data.city,
        lat: data.lat,
        lng: data.lng,
        userId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.donation.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.donation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, userId: number, data: any) {
    const donation = await this.prisma.donation.findFirst({
      where: { id, userId },
    });
    if (!donation) throw new Error('Donation not found or unauthorized');

    return this.prisma.donation.update({
      where: { id },
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl,
        city: data.city,
        lat: data.lat,
        lng: data.lng,
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const donation = await this.prisma.donation.findFirst({
      where: { id, userId },
    });
    if (!donation) throw new Error('Donation not found or unauthorized');

    return this.prisma.donation.delete({
      where: { id },
    });
  }
}
