import { ICRUDRepository } from '@smendivil/crud';
import { UserEntity } from '../user/user.entity';

export interface IUserRepository extends ICRUDRepository<UserEntity> {
    addUser(user: UserEntity): Promise<UserEntity>;
    getUserById(id: string): Promise<UserEntity | null>;
    updateUser(user: UserEntity): Promise<UserEntity | null>;
    deleteUser(id: string): Promise<boolean>;
    getAllUsers(): Promise<UserEntity[]>;
}


