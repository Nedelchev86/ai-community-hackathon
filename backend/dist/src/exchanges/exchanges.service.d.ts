import { PrismaService } from '../prisma/prisma.service';
export declare class ExchangesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, donationId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        requesterCompleted: boolean;
        ownerCompleted: boolean;
        donationId: number;
        requesterId: number;
    }>;
    getMyRequests(userId: number): Promise<({
        donation: {
            user: {
                id: number;
                email: string;
                name: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            title: string;
            description: string;
            category: string;
            imageUrl: string | null;
            city: string | null;
            lat: number | null;
            lng: number | null;
            status: string;
            userId: number;
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
    })[]>;
    getMyReceivedRequests(userId: number): Promise<({
        donation: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            title: string;
            description: string;
            category: string;
            imageUrl: string | null;
            city: string | null;
            lat: number | null;
            lng: number | null;
            status: string;
            userId: number;
        };
        requester: {
            id: number;
            email: string;
            name: string | null;
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
    })[]>;
    acceptRequest(userId: number, exchangeId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        description: string;
        category: string;
        imageUrl: string | null;
        city: string | null;
        lat: number | null;
        lng: number | null;
        status: string;
        userId: number;
    }>;
    completeRequest(userId: number, exchangeId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        requesterCompleted: boolean;
        ownerCompleted: boolean;
        donationId: number;
        requesterId: number;
    }>;
}
