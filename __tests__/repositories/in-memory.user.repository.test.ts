import { InMemoryUserRepository } from '../../src/repositories/in-memory.user.repository';
import { UserEntity } from '../../src/user/user.entity';

describe('InMemoryUserRepository', () => {
    let repository: InMemoryUserRepository;
    let testUser: UserEntity;

    beforeEach(() => {
        repository = new InMemoryUserRepository();
        testUser = new UserEntity('test', 'test@test.com', '1234567890');
    });

    describe('CRUD Operations', () => {
        it('should create and retrieve user', async () => {
            const created = await repository.addUser(testUser);
            expect(created).toEqual(testUser);
            const found = await repository.getUserById(testUser.id);
            expect(found).toEqual(testUser);
        });

        it('should update user', async () => {
            await repository.addUser(testUser);
            const updatedUser = new UserEntity(
                'updated',
                'updated@test.com',
                '9999999999',
                testUser.id
            );
            const result = await repository.updateUser(updatedUser);
            expect(result?.username).toBe('updated');
            expect(result?.email).toBe('updated@test.com');
            expect(result?.phoneNumber).toBe('9999999999');
        });

        it('should maintain timestamps on update', async () => {
            const created = await repository.addUser(testUser);
            const initialUpdatedAt = created.updatedAt;
            
            await new Promise(resolve => setTimeout(resolve, 1));
            
            const updatedUser = new UserEntity(
                'updated',
                testUser.email,
                testUser.phoneNumber,
                testUser.id
            );
            const updated = await repository.updateUser(updatedUser);
            expect(updated?.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
        });

        it('should delete user', async () => {
            await repository.addUser(testUser);
            const deleted = await repository.deleteUser(testUser.id);
            expect(deleted).toBe(true);
            const found = await repository.getUserById(testUser.id);
            expect(found).toBeNull();
        });

        it('should list all users', async () => {
            const user2 = new UserEntity('test2', 'test2@test.com', '0987654321');
            await repository.addUser(testUser);
            await repository.addUser(user2);
            const all = await repository.getAllUsers();
            expect(all).toHaveLength(2);
            expect(all).toContainEqual(testUser);
            expect(all).toContainEqual(user2);
        });
    });

    describe('Error Handling', () => {
        it('should handle updates to non-existent users', async () => {
            const nonExistentUser = new UserEntity('test', 'test@test.com', '1234567890');
            const result = await repository.updateUser(nonExistentUser);
            expect(result).toBeNull();
        });

        it('should handle deletion of non-existent users', async () => {
            const result = await repository.deleteUser('non-existent');
            expect(result).toBe(false);
        });
    });

    describe('Entity Management', () => {
        it('should create new instances on update', async () => {
            const created = await repository.addUser(testUser);
            const updated = await repository.updateUser({
                ...created,
                username: 'updated'
            } as UserEntity);
            
            expect(updated).not.toBe(created);
            expect(updated).toBeInstanceOf(UserEntity);
        });

        it('should preserve entity identity across operations', async () => {
            const created = await repository.addUser(testUser);
            const found = await repository.getUserById(created.id);
            expect(found?.id).toBe(created.id);
            expect(found?.createdAt).toEqual(created.createdAt);
        });
    });
});


