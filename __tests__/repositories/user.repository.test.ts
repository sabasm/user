import { UserRepository } from '../../src/repositories/user.repository';
import { UserEntity } from '../../src/user/user.entity';

class TestUserRepository extends UserRepository {
    private entities: Map<string, UserEntity>;
    private testDelay = 10;

    constructor() {
        super();
        this.entities = new Map();
    }

    protected async performCreate(entity: UserEntity): Promise<UserEntity> {
        await this.delay();
        const storedEntity = new UserEntity(
            entity.username,
            entity.email,
            entity.phoneNumber,
            entity.id,
            entity.createdAt,
            entity.updatedAt
        );
        this.entities.set(entity.id, storedEntity);
        return storedEntity;
    }

    protected async performUpdate(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null> {
        await this.delay();
        const existing = await this.performFindById(id);
        if (!existing) return null;

        const updated = new UserEntity(
            updates.username || existing.username,
            updates.email || existing.email,
            updates.phoneNumber || existing.phoneNumber,
            existing.id,
            existing.createdAt,
            updates.updatedAt || new Date()
        );

        this.entities.set(id, updated);
        return updated;
    }

    protected async performFindById(id: string): Promise<UserEntity | null> {
        return this.entities.get(id) || null;
    }

    protected async performDelete(id: string): Promise<boolean> {
        return this.entities.delete(id);
    }

    protected async performFindAll(): Promise<UserEntity[]> {
        return Array.from(this.entities.values());
    }

    private async delay(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, this.testDelay));
    }

    async clearEntities(): Promise<void> {
        this.entities.clear();
    }
}

describe('UserRepository', () => {
    let repository: TestUserRepository;
    let testUser: UserEntity;

    beforeEach(() => {
        repository = new TestUserRepository();
        testUser = new UserEntity('test', 'test@test.com', '1234567890');
    });

    describe('Base Operations', () => {
        it('should create and store entity', async () => {
            const stored = await repository.create(testUser);
            expect(stored).toBeInstanceOf(UserEntity);
            expect(stored.id).toBe(testUser.id);
        });

        it('should find stored entity', async () => {
            await repository.create(testUser);
            const found = await repository.findById(testUser.id);
            expect(found).toBeInstanceOf(UserEntity);
            expect(found?.id).toBe(testUser.id);
        });

        it('should update entity', async () => {
            await repository.create(testUser);
            const update = { username: 'updated' };
            const updated = await repository.update(testUser.id, update);
            expect(updated?.username).toBe('updated');
        });

        it('should delete entity', async () => {
            await repository.create(testUser);
            const result = await repository.delete(testUser.id);
            expect(result).toBe(true);
            const found = await repository.findById(testUser.id);
            expect(found).toBeNull();
        });
    });

    afterEach(async () => {
        await repository.clearEntities();
    });
});


