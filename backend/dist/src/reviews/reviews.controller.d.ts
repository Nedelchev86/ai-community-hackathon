import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(req: any, body: {
        exchangeId: number;
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
    getMyReviews(req: any): Promise<({
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
