import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            firstName: any;
            lastName: any;
            email: any;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    validate(req: any): Promise<{
        valid: boolean;
        user: any;
    }>;
}
