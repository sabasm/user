import { UserEntity } from '../user/user.entity';

/**
 * Interface for user repository implementations.
 */
export interface IUserRepository {
    addUser(user: UserEntity): Promise<Partial<UserEntity>>;
    getUserById(id: string): Promise<Partial<UserEntity> | null>;
    updateUser(user: UserEntity): Promise<Partial<UserEntity>>;
    deleteUser(id: string): Promise<boolean>;
    getAllUsers(): Promise<Partial<UserEntity>[]>;
}


