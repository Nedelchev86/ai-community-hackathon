import { ExchangesService } from './exchanges.service';
export declare class ExchangesController {
    private readonly exchangesService;
    constructor(exchangesService: ExchangesService);
    createRequest(req: any, donationId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        requesterCompleted: boolean;
        ownerCompleted: boolean;
        donationId: number;
        requesterId: number;
    }>;
    getMyRequests(req: any): Promise<({
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
    getReceivedRequests(req: any): Promise<({
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
    acceptRequest(req: any, id: string): Promise<{
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
    completeRequest(req: any, id: string): Promise<{
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
