import { UserEntity } from '../src/user/user.entity';
describe('UserEntity', () => {
  it('should create a new UserEntity instance', () => {
    const user = new UserEntity('testuser', 'test@example.com', '1234567890');
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.phoneNumber).toBe('1234567890');
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });
  it('should create a UserEntity from data', () => {
    const data = { id: '123', username: 'testuser', email: 'test@example.com', phoneNumber: '1234567890', createdAt: new Date('2022-01-01T00:00:00Z'), updatedAt: new Date('2022-01-02T00:00:00Z') };
    const user = UserEntity.fromData(data);
    expect(user.id).toBe('123');
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.phoneNumber).toBe('1234567890');
    expect(user.createdAt.toISOString()).toBe('2022-01-01T00:00:00.000Z');
    expect(user.updatedAt.toISOString()).toBe('2022-01-02T00:00:00.000Z');
  });
  it('should convert UserEntity to data', () => {
    const user = new UserEntity('testuser', 'test@example.com', '1234567890');
    const data = user.toData();
    expect(data.username).toBe('testuser');
    expect(data.email).toBe('test@example.com');
    expect(data.phoneNumber).toBe('1234567890');
    expect(data.id).toBe(user.id);
    expect(data.createdAt).toBe(user.createdAt);
    expect(data.updatedAt).toBe(user.updatedAt);
  });
  it('should update timestamp', () => {
    const user = new UserEntity('testuser', 'test@example.com', '1234567890');
    const oldUpdatedAt = user.updatedAt;
    user.updateTimestamp();
    expect(user.updatedAt).not.toBe(oldUpdatedAt);
  });

  it('should create entity from empty data', () => {
    const user = UserEntity.fromData({});
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.username).toBe('');
    expect(user.email).toBe('');
    expect(user.phoneNumber).toBe('');
  });

  it('should get entity details', () => {
    const user = new UserEntity('testuser', 'test@example.com', '1234567890');
    const details = user.getEntityDetails();
    expect(details).toBe('User: testuser, Email: test@example.com, Phone: 1234567890');
  });
});


