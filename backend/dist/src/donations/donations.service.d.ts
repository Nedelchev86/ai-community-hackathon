import { PrismaService } from '../prisma/prisma.service';
export declare class DonationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, data: any): Promise<{
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
    findAll(): Promise<({
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
    })[]>;
    findByUser(userId: number): Promise<{
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
    }[]>;
    update(id: number, userId: number, data: any): Promise<{
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
    remove(id: number, userId: number): Promise<{
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
}
