import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: any) {
    return this.prisma.user.create({ data });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findRecent(limit: number = 5) {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        city: true,
        createdAt: true,
        _count: {
          select: { donations: true },
        },
      },
    });
  }

  async findAllHeroes() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        city: true,
        createdAt: true,
        _count: {
          select: { donations: true },
        },
        reviewsReceived: {
          select: { rating: true },
        },
      },
    });

    const heroes = users.map((user) => {
      const reviewCount = user.reviewsReceived.length;
      const averageRating =
        reviewCount > 0
          ? user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
            reviewCount
          : 0;

      // Remove raw reviews to keep payload small
      const { reviewsReceived, ...userData } = user;
      return {
        ...userData,
        averageRating,
        reviewCount,
      };
    });

    return heroes.sort(
      (a, b) =>
        b.averageRating - a.averageRating ||
        b._count.donations - a._count.donations,
    );
  }

  async update(id: number, data: any) {
    const updateData: any = {
      name: data.name,
      avatarUrl: data.avatarUrl,
      phone: data.phone,
      city: data.city,
      bio: data.bio,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }
}
