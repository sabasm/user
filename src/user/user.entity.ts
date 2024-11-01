import { BaseEntity } from '@smendivil/entity';

/**
 * Class representing a user.
 * This class is ORM-agnostic and can be used in any environment.
 */
export class UserEntity extends BaseEntity {
    username: string;
    email: string;
    phoneNumber: string;

    constructor(
        username: string,
        email: string,
        phoneNumber: string,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(id);
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        if (createdAt) this.createdAt = createdAt;
        if (updatedAt) this.updatedAt = updatedAt;
    }

    /**
     * Creates a UserEntity instance from a plain object.
     * @param data Plain object containing user data.
     * @returns UserEntity instance.
     */
    static fromData(data: Partial<UserEntity>): UserEntity {
        return new UserEntity(
            data.username || '',
            data.email || '',
            data.phoneNumber || '',
            data.id,
            data.createdAt,
            data.updatedAt
        );
    }

    /**
     * Returns a plain object representation of the user.
     * @returns Plain object with user data.
     */
    toData(): Partial<UserEntity> {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            phoneNumber: this.phoneNumber,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    /**
     * Returns a string representation of the user's details.
     */
    getEntityDetails(): string {
        return `User: ${this.username}, Email: ${this.email}, Phone: ${this.phoneNumber}`;
    }
}


