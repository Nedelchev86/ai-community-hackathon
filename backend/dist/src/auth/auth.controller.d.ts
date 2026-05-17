import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        id: number;
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string | null;
        };
    }>;
}
