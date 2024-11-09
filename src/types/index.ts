import { UserEntity } from '../user/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export type { UserEntity };
export type { IUserRepository };


