import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(id: string): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
