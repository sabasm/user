import { UserRepository } from './user.repository';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * TypeORM implementation of the user repository.
 */
export class TypeORMUserRepository extends UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
    ) {
        super();
    }

    async addUser(user: UserEntity): Promise<Partial<UserEntity>> {
        const savedUser = await this.repository.save(user);
        return savedUser.toData();
    }

    async getUserById(id: string): Promise<Partial<UserEntity> | null> {
        const user = await this.repository.findOne({ where: { id } });
        return user ? user.toData() : null;
    }

    async updateUser(user: UserEntity): Promise<Partial<UserEntity>> {
        const updatedUser = await this.repository.save(user);
        return updatedUser.toData();
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }

    async getAllUsers(): Promise<Partial<UserEntity>[]> {
        const users = await this.repository.find();
        return users.map(user => user.toData());
    }
}


