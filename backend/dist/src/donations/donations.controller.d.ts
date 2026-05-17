import { DonationsService } from './donations.service';
export declare class DonationsController {
    private readonly donationsService;
    constructor(donationsService: DonationsService);
    create(req: any, body: any): Promise<{
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
    findMine(req: any): Promise<{
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
    update(id: string, req: any, body: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
