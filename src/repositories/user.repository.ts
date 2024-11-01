import { IUserRepository } from '../interfaces/user.repository.interface';
import { UserEntity } from '../user/user.entity';

/**
 * Abstract class for user repositories.
 * Concrete implementations should extend this class.
 */
export abstract class UserRepository implements IUserRepository {
    abstract addUser(user: UserEntity): Promise<Partial<UserEntity>>;
    abstract getUserById(id: string): Promise<Partial<UserEntity> | null>;
    abstract updateUser(user: UserEntity): Promise<Partial<UserEntity>>;
    abstract deleteUser(id: string): Promise<boolean>;
    abstract getAllUsers(): Promise<Partial<UserEntity>[]>;
}


