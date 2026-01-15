import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    validateUser(email: string, password: string): Promise<User | null>;
}
