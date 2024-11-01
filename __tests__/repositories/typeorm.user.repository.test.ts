// __tests__/repositories/typeorm.user.repository.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeORMUserRepository } from '../../src/repositories/typeorm.user.repository';
import { Repository, DeleteResult } from 'typeorm';
import { UserEntity } from '../../src/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TypeORMUserRepository', () => {
  let repository: TypeORMUserRepository;
  let typeormRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeORMUserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TypeORMUserRepository>(TypeORMUserRepository);
    typeormRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should add a user', async () => {
    const user = new UserEntity('test', 'test@test.com', '1234567890');
    const savedData = user.toData();
    jest.spyOn(typeormRepository, 'save').mockResolvedValue(user);

    const result = await repository.addUser(user);
    expect(result).toEqual(savedData);
    expect(typeormRepository.save).toHaveBeenCalledWith(user);
  });

  it('should get a user by id', async () => {
    const user = new UserEntity('test', 'test@test.com', '1234567890');
    jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(user);

    const result = await repository.getUserById('test-id');
    expect(result).toEqual(user.toData());
    expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
  });

  it('should return null when user is not found', async () => {
    jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(null);

    const result = await repository.getUserById('test-id');
    expect(result).toBeNull();
  });

  it('should update a user', async () => {
    const user = new UserEntity('test', 'test@test.com', '1234567890');
    jest.spyOn(typeormRepository, 'save').mockResolvedValue(user);

    const result = await repository.updateUser(user);
    expect(result).toEqual(user.toData());
    expect(typeormRepository.save).toHaveBeenCalledWith(user);
  });

  it('should delete a user', async () => {
    const deleteResult: DeleteResult = {
      affected: 1,
      raw: []
    };
    jest.spyOn(typeormRepository, 'delete').mockResolvedValue(deleteResult);

    const result = await repository.deleteUser('test-id');
    expect(result).toBe(true);
    expect(typeormRepository.delete).toHaveBeenCalledWith('test-id');
  });

  it('should return false when no user is deleted', async () => {
    const deleteResult: DeleteResult = {
      affected: 0,
      raw: []
    };
    jest.spyOn(typeormRepository, 'delete').mockResolvedValue(deleteResult);

    const result = await repository.deleteUser('test-id');
    expect(result).toBe(false);
  });

  it('should get all users', async () => {
    const users = [
      new UserEntity('test1', 'test1@test.com', '1234567890'),
      new UserEntity('test2', 'test2@test.com', '0987654321')
    ];
    jest.spyOn(typeormRepository, 'find').mockResolvedValue(users);

    const result = await repository.getAllUsers();
    expect(result).toEqual(users.map(user => user.toData()));
    expect(typeormRepository.find).toHaveBeenCalled();
  });
});