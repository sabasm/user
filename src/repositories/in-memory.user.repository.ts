import { UserRepository } from './user.repository';
import { UserEntity } from '../user/user.entity';

export class InMemoryUserRepository extends UserRepository {
    private readonly entities: Map<string, UserEntity>;

    constructor() {
        super();
        this.entities = new Map();
    }

    protected async performCreate(entity: UserEntity): Promise<UserEntity> {
        this.entities.set(entity.id, entity);
        return entity;
    }

    protected async performUpdate(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null> {
        const existing = await this.performFindById(id);
        if (!existing) return null;

        const updated = Object.assign(new UserEntity(
            existing.username,
            existing.email,
            existing.phoneNumber,
            existing.id
        ), updates);

        this.entities.set(id, updated);
        return updated;
    }

    protected async performFindById(id: string): Promise<UserEntity | null> {
        return this.entities.get(id) || null;
    }

    protected async performDelete(id: string): Promise<boolean> {
        return this.entities.delete(id);
    }

    protected async performFindAll(params?: any): Promise<UserEntity[]> {
        return Array.from(this.entities.values());
    }
}


