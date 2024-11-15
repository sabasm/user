import { Test, TestingModule } from '@nestjs/testing';
import { TypeORMUserRepository } from '../../src/repositories/typeorm.user.repository';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { UserEntity } from '../../src/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TypeORMUserRepository', () => {
    let repository: TypeORMUserRepository;
    let typeormRepository: Repository<UserEntity>;
    let testEntity: UserEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeORMUserRepository,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<TypeORMUserRepository>(TypeORMUserRepository);
        typeormRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
        testEntity = new UserEntity('test', 'test@test.com', '1234567890');
    });

    it('should add a user', async () => {
        jest.spyOn(typeormRepository, 'save').mockResolvedValue(testEntity);
        const result = await repository.addUser(testEntity);
        expect(result).toEqual(testEntity);
        expect(typeormRepository.save).toHaveBeenCalledWith(testEntity);
    });

    it('should get a user by id', async () => {
        jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(testEntity);
        const result = await repository.getUserById('test-id');
        expect(result).toEqual(testEntity);
        expect(typeormRepository.findOne).toHaveBeenCalledWith({
            where: { id: 'test-id' }
        });
    });

    it('should return null when user is not found', async () => {
        jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(null);
        const result = await repository.getUserById('test-id');
        expect(result).toBeNull();
    });

    it('should update a user', async () => {
        const updateResult: UpdateResult = { affected: 1, generatedMaps: [], raw: [] };
        jest.spyOn(typeormRepository, 'update').mockResolvedValue(updateResult);
        jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(testEntity);

        const result = await repository.updateUser(testEntity);
        expect(result).toEqual(testEntity);
        expect(typeormRepository.update).toHaveBeenCalledWith(
            { id: testEntity.id },
            {
                username: testEntity.username,
                email: testEntity.email,
                phoneNumber: testEntity.phoneNumber,
                createdAt: testEntity.createdAt,
                updatedAt: expect.any(Date)
            }
        );
    });

    it('should delete a user', async () => {
        const deleteResult: DeleteResult = { affected: 1, raw: [] };
        jest.spyOn(typeormRepository, 'delete').mockResolvedValue(deleteResult);

        const result = await repository.deleteUser('test-id');
        expect(result).toBe(true);
        expect(typeormRepository.delete).toHaveBeenCalledWith({ id: 'test-id' });
    });

    it('should return false when no user is deleted', async () => {
        const deleteResult: DeleteResult = { affected: 0, raw: [] };
        jest.spyOn(typeormRepository, 'delete').mockResolvedValue(deleteResult);

        const result = await repository.deleteUser('test-id');
        expect(result).toBe(false);
    });

    it('should get all users', async () => {
        const users = [
            testEntity,
            new UserEntity('test2', 'test2@test.com', '0987654321')
        ];
        jest.spyOn(typeormRepository, 'find').mockResolvedValue(users);

        const result = await repository.getAllUsers();
        expect(result).toEqual(users);
        expect(typeormRepository.find).toHaveBeenCalled();
    });
});


