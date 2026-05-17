import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
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
          include: {
            user: {
              select: { name: true, email: true, id: true, avatarUrl: true },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: { name: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        supports: {
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
        lat: data.lat ? parseFloat(data.lat) : null,
        lng: data.lng ? parseFloat(data.lng) : null,
        maxParticipants: data.maxParticipants,
        organizerId: userId,
      },
      include: {
        organizer: { select: { name: true } },
      },
    });
  }

  async updateEvent(userId: number, eventId: number, data: any) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can edit this event');
    }

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl,
        date: data.date ? new Date(data.date) : undefined,
        location: data.location,
        lat: data.lat ? parseFloat(data.lat) : null,
        lng: data.lng ? parseFloat(data.lng) : null,
        maxParticipants: data.maxParticipants,
      },
    });
  }

  async deleteEvent(userId: number, eventId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can delete this event');
    }

    // Delete related
    await this.prisma.eventParticipant.deleteMany({ where: { eventId } });
    await this.prisma.eventComment.deleteMany({ where: { eventId } });
    await this.prisma.eventSupport.deleteMany({ where: { eventId } });

    return this.prisma.event.delete({
      where: { id: eventId },
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

  async addComment(userId: number, eventId: number, content: string) {
    if (!content) {
      throw new BadRequestException('Content is required');
    }
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return this.prisma.eventComment.create({
      data: {
        content,
        eventId,
        userId,
      },
      include: {
        user: { select: { name: true, avatarUrl: true } },
      },
    });
  }

  async toggleSupport(userId: number, eventId: number) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const existing = await this.prisma.eventSupport.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });
    if (existing) {
      await this.prisma.eventSupport.delete({ where: { id: existing.id } });
      return { supported: false };
    } else {
      await this.prisma.eventSupport.create({
        data: { eventId, userId },
      });
      return { supported: true };
    }
  }
}
