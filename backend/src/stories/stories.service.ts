import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async getAllStories() {
    return this.prisma.story.findMany({
      include: {
        author: {
          select: { name: true, avatarUrl: true, city: true },
        },
        comments: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        supports: {
          select: { userId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createStory(userId: number, data: any) {
    return this.prisma.story.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        tags: data.tags, // Comma-separated
        authorId: userId,
      },
      include: {
        author: { select: { name: true } },
      },
    });
  }

  async updateStory(userId: number, storyId: number, data: any) {
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new NotFoundException('Story not found');
    if (story.authorId !== userId) throw new ForbiddenException('Not your story');

    return this.prisma.story.update({
      where: { id: storyId },
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        tags: data.tags,
      },
    });
  }

  async deleteStory(userId: number, storyId: number) {
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new NotFoundException('Story not found');
    if (story.authorId !== userId) throw new ForbiddenException('Not your story');

    await this.prisma.storyComment.deleteMany({ where: { storyId } });
    await this.prisma.storySupport.deleteMany({ where: { storyId } });

    return this.prisma.story.delete({ where: { id: storyId } });
  }

  async addComment(userId: number, storyId: number, content: string) {
    if (!content) throw new BadRequestException('Content required');
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new NotFoundException('Story not found');

    return this.prisma.storyComment.create({
      data: { content, storyId, userId },
      include: { user: { select: { name: true, avatarUrl: true } } },
    });
  }

  async toggleSupport(userId: number, storyId: number) {
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new NotFoundException('Story not found');

    const existing = await this.prisma.storySupport.findUnique({
      where: { storyId_userId: { storyId, userId } },
    });

    if (existing) {
      await this.prisma.storySupport.delete({ where: { id: existing.id } });
      return { supported: false };
    } else {
      await this.prisma.storySupport.create({ data: { storyId, userId } });
      return { supported: true };
    }
  }
}
