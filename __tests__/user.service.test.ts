// __tests__/user.service.test.ts
import { UserService } from '../src/user/user.service';
import { InMemoryUserRepository } from '../src/repositories/in-memory.user.repository';
import { UserEntity } from '../src/user/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userService = new UserService(userRepository);
  });

  it('should add a new user', async () => {
    const user = await userService.addUser('testuser', 'test@example.com', '1234567890');
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.phoneNumber).toBe('1234567890');
  });

  it('should get a user by ID', async () => {
    const createdUser = await userService.addUser('testuser', 'test@example.com', '1234567890');
    const retrievedUser = await userService.getUserById(createdUser.id);
    expect(retrievedUser).not.toBeNull();
    expect(retrievedUser?.id).toBe(createdUser.id);
  });

  it('should update a user', async () => {
    const createdUser = await userService.addUser('testuser', 'test@example.com', '1234567890');
    const updatedUser = await userService.updateUser(createdUser.id, 'updateduser');
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.username).toBe('updateduser');
  });

  it('should delete a user', async () => {
    const createdUser = await userService.addUser('testuser', 'test@example.com', '1234567890');
    const deleteResult = await userService.deleteUser(createdUser.id);
    expect(deleteResult).toBe(true);
    const retrievedUser = await userService.getUserById(createdUser.id);
    expect(retrievedUser).toBeNull();
  });

  it('should get all users with pagination', async () => {
    await userService.addUser('user1', 'user1@example.com', '1111111111');
    await userService.addUser('user2', 'user2@example.com', '2222222222');

    const paginatedUsers = await userService.getAllUsers({ page: 1, limit: 10 });

    expect(paginatedUsers.data.length).toBe(2);
    expect(paginatedUsers.total).toBe(2);
    expect(paginatedUsers.page).toBe(1);
    expect(paginatedUsers.limit).toBe(10);
    expect(paginatedUsers.totalPages).toBe(1);
    expect(paginatedUsers.hasNext).toBe(false);
    expect(paginatedUsers.hasPrevious).toBe(false);
  });

  it('should handle pagination with multiple pages', async () => {
    await userService.addUser('user1', 'user1@example.com', '1111111111');
    await userService.addUser('user2', 'user2@example.com', '2222222222');
    await userService.addUser('user3', 'user3@example.com', '3333333333');

    const paginatedUsers = await userService.getAllUsers({ page: 1, limit: 2 });

    expect(paginatedUsers.data.length).toBe(2);
    expect(paginatedUsers.total).toBe(3);
    expect(paginatedUsers.page).toBe(1);
    expect(paginatedUsers.limit).toBe(2);
    expect(paginatedUsers.totalPages).toBe(2);
    expect(paginatedUsers.hasNext).toBe(true);
    expect(paginatedUsers.hasPrevious).toBe(false);
  });

  it('should throw error for invalid pagination parameters', async () => {
    await expect(userService.getAllUsers({ page: 0, limit: 10 }))
      .rejects.toThrow('Page must be greater than 0');

    await expect(userService.getAllUsers({ page: 1, limit: 0 }))
      .rejects.toThrow('Limit must be greater than 0');
  });

  it('should return empty page when page number exceeds total pages', async () => {
    await userService.addUser('user1', 'user1@example.com', '1111111111');
    const paginatedUsers = await userService.getAllUsers({ page: 2, limit: 10 });

    expect(paginatedUsers.data).toHaveLength(0);
    expect(paginatedUsers.total).toBe(1);
    expect(paginatedUsers.page).toBe(2);
    expect(paginatedUsers.totalPages).toBe(1);
    expect(paginatedUsers.hasNext).toBe(false);
    expect(paginatedUsers.hasPrevious).toBe(true);
  });

  it('should handle last page pagination correctly', async () => {
    // Add 5 users
    for (let i = 1; i <= 5; i++) {
      await userService.addUser(
        `user${i}`,
        `user${i}@example.com`,
        `${i}`.repeat(10)
      );
    }

    // Get last page with limit of 2 (should contain 1 user)
    const lastPage = await userService.getAllUsers({ page: 3, limit: 2 });

    expect(lastPage.data).toHaveLength(1);
    expect(lastPage.total).toBe(5);
    expect(lastPage.page).toBe(3);
    expect(lastPage.limit).toBe(2);
    expect(lastPage.totalPages).toBe(3);
    expect(lastPage.hasNext).toBe(false);
    expect(lastPage.hasPrevious).toBe(true);
  });

  it('should handle empty user list pagination correctly', async () => {
    const paginatedUsers = await userService.getAllUsers({ page: 1, limit: 10 });

    expect(paginatedUsers.data).toHaveLength(0);
    expect(paginatedUsers.total).toBe(0);
    expect(paginatedUsers.page).toBe(1);
    expect(paginatedUsers.limit).toBe(10);
    expect(paginatedUsers.totalPages).toBe(0);
    expect(paginatedUsers.hasNext).toBe(false);
    expect(paginatedUsers.hasPrevious).toBe(false);
  });

  it('should handle single user with exact limit pagination', async () => {
    await userService.addUser('user1', 'user1@example.com', '1111111111');
    const paginatedUsers = await userService.getAllUsers({ page: 1, limit: 1 });

    expect(paginatedUsers.data).toHaveLength(1);
    expect(paginatedUsers.total).toBe(1);
    expect(paginatedUsers.page).toBe(1);
    expect(paginatedUsers.limit).toBe(1);
    expect(paginatedUsers.totalPages).toBe(1);
    expect(paginatedUsers.hasNext).toBe(false);
    expect(paginatedUsers.hasPrevious).toBe(false);
  });

  it('should handle updating non-existent user', async () => {
    const updatedUser = await userService.updateUser(
      'non-existent-id',
      'updateduser',
      'updated@example.com',
      '9999999999'
    );
    expect(updatedUser).toBeNull();
  });

  it('should handle partial user updates', async () => {
    const user = await userService.addUser('testuser', 'test@example.com', '1234567890');

    // Update only email
    const updatedEmail = await userService.updateUser(user.id, undefined, 'newemail@example.com');
    expect(updatedEmail?.email).toBe('newemail@example.com');
    expect(updatedEmail?.username).toBe('testuser');
    expect(updatedEmail?.phoneNumber).toBe('1234567890');

    // Update only phone number
    const updatedPhone = await userService.updateUser(user.id, undefined, undefined, '9999999999');
    expect(updatedPhone?.email).toBe('newemail@example.com');
    expect(updatedPhone?.username).toBe('testuser');
    expect(updatedPhone?.phoneNumber).toBe('9999999999');
  });
});
