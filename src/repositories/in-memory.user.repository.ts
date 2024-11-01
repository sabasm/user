import { UserRepository } from './user.repository';
import { UserEntity } from '../user/user.entity';

/**
 * In-memory implementation of the user repository.
 * Useful for testing or development purposes.
 */
export class InMemoryUserRepository extends UserRepository {
    private users: Map<string, Partial<UserEntity>> = new Map();

    async addUser(user: UserEntity): Promise<Partial<UserEntity>> {
        const data = user.toData();
        this.users.set(user.id, data);
        return data;
    }

    async getUserById(id: string): Promise<Partial<UserEntity> | null> {
        return this.users.get(id) || null;
    }

    async updateUser(user: UserEntity): Promise<Partial<UserEntity>> {
        const data = user.toData();
        this.users.set(user.id, data);
        return data;
    }

    async deleteUser(id: string): Promise<boolean> {
        return this.users.delete(id);
    }

    async getAllUsers(): Promise<Partial<UserEntity>[]> {
        return Array.from(this.users.values());
    }
}


