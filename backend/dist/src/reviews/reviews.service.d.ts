import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, exchangeId: number, data: {
        rating: number;
        comment?: string;
        imageUrl?: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        imageUrl: string | null;
        exchangeId: number;
        reviewerId: number;
        revieweeId: number;
        rating: number;
        comment: string | null;
    }>;
    getMyReviews(userId: number): Promise<({
        exchange: {
            donation: {
                title: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            requesterCompleted: boolean;
            ownerCompleted: boolean;
            donationId: number;
            requesterId: number;
        };
        reviewer: {
            id: number;
            name: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        imageUrl: string | null;
        exchangeId: number;
        reviewerId: number;
        revieweeId: number;
        rating: number;
        comment: string | null;
    })[]>;
}
