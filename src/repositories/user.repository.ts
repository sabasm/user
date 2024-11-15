import { BaseCRUDRepository } from '@smendivil/crud';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { UserEntity } from '../user/user.entity';

export abstract class UserRepository extends BaseCRUDRepository<UserEntity> implements IUserRepository {
    protected constructor() {
        super();
    }

    async create(entity: UserEntity): Promise<UserEntity> {
        entity.updateTimestamp();
        return this.performCreate(entity);
    }

    async update(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null> {
        updates.updatedAt = new Date();
        return this.performUpdate(id, updates);
    }

    async findById(id: string): Promise<UserEntity | null> {
        return this.performFindById(id);
    }

    async delete(id: string): Promise<boolean> {
        return this.performDelete(id);
    }

    async findAll(params?: any): Promise<UserEntity[]> {
        return this.performFindAll(params);
    }

    // IUserRepository specific methods
    async addUser(user: UserEntity): Promise<UserEntity> {
        return this.create(user);
    }

    async getUserById(id: string): Promise<UserEntity | null> {
        return this.findById(id);
    }

    async updateUser(user: UserEntity): Promise<UserEntity | null> {
        const { id, ...updates } = user;
        return this.update(id, updates);
    }

    async deleteUser(id: string): Promise<boolean> {
        return this.delete(id);
    }

    async getAllUsers(): Promise<UserEntity[]> {
        return this.findAll();
    }

    // Template methods to be implemented by concrete repositories
    protected abstract performCreate(entity: UserEntity): Promise<UserEntity>;
    protected abstract performUpdate(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null>;
    protected abstract performFindById(id: string): Promise<UserEntity | null>;
    protected abstract performDelete(id: string): Promise<boolean>;
    protected abstract performFindAll(params?: any): Promise<UserEntity[]>;
}


