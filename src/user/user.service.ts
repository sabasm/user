import { BaseCRUDService } from '@smendivil/crud';
import { UserEntity } from './user.entity';
import { Injectable, Inject } from '@nestjs/common';
import { ICRUDRepository } from '@smendivil/crud';
import { PaginationParams, PaginatedResponse } from '../types';

@Injectable()
export class UserService extends BaseCRUDService<UserEntity> {
    constructor(
        @Inject('ICRUDRepository')
        private readonly userRepository: ICRUDRepository<UserEntity>
    ) {
        super(userRepository);
    }

    async addUser(
        username: string,
        email: string,
        phoneNumber: string,
        id?: string
    ): Promise<UserEntity> {
        const user = new UserEntity(username, email, phoneNumber, id);
        return await this.userRepository.create(user);
    }

    async getUserById(id: string): Promise<UserEntity | null> {
        return await this.userRepository.findById(id);
    }

    async updateUser(
        id: string,
        username?: string,
        email?: string,
        phoneNumber?: string
    ): Promise<UserEntity | null> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) return null;

        const updates: Partial<UserEntity> = {};
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (phoneNumber) updates.phoneNumber = phoneNumber;

        return await this.userRepository.update(id, updates);
    }

    async deleteUser(id: string): Promise<boolean> {
        return await this.userRepository.delete(id);
    }

    async getAllUsers(params: PaginationParams): Promise<PaginatedResponse<UserEntity>> {
        if (params.page < 1) throw new Error('Page must be greater than 0');
        if (params.limit < 1) throw new Error('Limit must be greater than 0');

        const data = await this.userRepository.findAll();
        const total = data.length;
        const totalPages = Math.ceil(total / params.limit);
        const startIndex = (params.page - 1) * params.limit;
        const endIndex = startIndex + params.limit;
        const paginatedData = data.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            total,
            page: params.page,
            limit: params.limit,
            totalPages,
            hasNext: params.page < totalPages,
            hasPrevious: params.page > 1
        };
    }
}


