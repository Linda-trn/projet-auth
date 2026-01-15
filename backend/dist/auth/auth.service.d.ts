import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            firstName: any;
            lastName: any;
            email: any;
        };
    }>;
    register(userData: any): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
