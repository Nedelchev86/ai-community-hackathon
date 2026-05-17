import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(data: any): Promise<{
        id: number;
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(userDto: any): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string | null;
        };
    }>;
}
