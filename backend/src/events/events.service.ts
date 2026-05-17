import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getAllEvents() {
    return this.prisma.event.findMany({
      include: {
        organizer: {
          select: { name: true, email: true, id: true, avatarUrl: true },
        },
        participants: {
          select: { userId: true },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async createEvent(userId: number, data: any) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl,
        date: new Date(data.date),
        location: data.location,
        maxParticipants: data.maxParticipants,
        organizerId: userId,
      },
      include: {
        organizer: { select: { name: true } },
      },
    });
  }

  async joinEvent(userId: number, eventId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.participants.length >= event.maxParticipants) {
      throw new BadRequestException('Event is full');
    }

    try {
      await this.prisma.eventParticipant.create({
        data: {
          eventId,
          userId,
        },
      });
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Already joined this event');
    }
  }
}
