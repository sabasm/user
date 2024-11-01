// src/user/user.service.ts
import { UserEntity } from './user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';

/**
 * Interface for pagination parameters
 */
export interface PaginationParams {
    page: number;
    limit: number;
}

/**
 * Interface for paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

/**
 * Service class for user operations.
 * Provides methods for managing user entities with CRUD operations and pagination support.
 */
export class UserService {
    /**
     * Creates a new instance of UserService
     * @param userRepository - Implementation of IUserRepository for data access
     */
    constructor(private userRepository: IUserRepository) { }

    /**
     * Adds a new user to the system.
     * @param username - User's username, must be unique
     * @param email - User's email address, must be valid email format
     * @param phoneNumber - User's phone number
     * @param id - Optional user ID, if not provided a new one will be generated
     * @returns Promise resolving to the newly created UserEntity
     * @throws Error if username or email already exists
     */
    async addUser(
        username: string,
        email: string,
        phoneNumber: string,
        id?: string
    ): Promise<UserEntity> {
        const user = new UserEntity(username, email, phoneNumber, id);
        const savedData = await this.userRepository.addUser(user);
        return UserEntity.fromData(savedData);
    }

    /**
     * Retrieves a user by their unique identifier.
     * @param id - The unique identifier of the user
     * @returns Promise resolving to UserEntity if found, null otherwise
     */
    async getUserById(id: string): Promise<UserEntity | null> {
        const data = await this.userRepository.getUserById(id);
        return data ? UserEntity.fromData(data) : null;
    }

    /**
     * Updates an existing user's information.
     * @param id - The unique identifier of the user to update
     * @param username - Optional new username
     * @param email - Optional new email address
     * @param phoneNumber - Optional new phone number
     * @returns Promise resolving to the updated UserEntity if found, null otherwise
     * @throws Error if new username or email conflicts with existing users
     */
    async updateUser(
        id: string,
        username?: string,
        email?: string,
        phoneNumber?: string
    ): Promise<UserEntity | null> {
        const existingData = await this.userRepository.getUserById(id);
        if (existingData) {
            const user = UserEntity.fromData(existingData);
            if (username) user.username = username;
            if (email) user.email = email;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            user.updateTimestamp();
            const updatedData = await this.userRepository.updateUser(user);
            return UserEntity.fromData(updatedData);
        }
        return null;
    }

    /**
     * Removes a user from the system.
     * @param id - The unique identifier of the user to delete
     * @returns Promise resolving to true if user was deleted, false if user was not found
     */
    async deleteUser(id: string): Promise<boolean> {
        return await this.userRepository.deleteUser(id);
    }

    /**
     * Retrieves a paginated list of users.
     * @param params - Pagination parameters including page number and items per page
     * @param params.page - The page number to retrieve (1-based)
     * @param params.limit - The number of items per page
     * @returns Promise resolving to a paginated response containing users and pagination metadata
     * @throws Error if pagination parameters are invalid
     */
    async getAllUsers(params: PaginationParams): Promise<PaginatedResponse<UserEntity>> {
        if (params.page < 1) throw new Error('Page must be greater than 0');
        if (params.limit < 1) throw new Error('Limit must be greater than 0');

        const data = await this.userRepository.getAllUsers();
        const total = data.length;
        const totalPages = Math.ceil(total / params.limit);
        const startIndex = (params.page - 1) * params.limit;
        const endIndex = startIndex + params.limit;
        const paginatedData = data.slice(startIndex, endIndex);

        return {
            data: paginatedData.map(userData => UserEntity.fromData(userData)),
            total,
            page: params.page,
            limit: params.limit,
            totalPages,
            hasNext: params.page < totalPages,
            hasPrevious: params.page > 1
        };
    }
}