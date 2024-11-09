import { CrudService } from '@smendivil/crud';
import { UserEntity } from './user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { WithTryCatch } from '@smendivil/utils';

export class UserService extends CrudService<UserEntity> {
  constructor(protected repository: IUserRepository) {
    super(repository);
  }

  @WithTryCatch({ 
    logError: true,
    transformError: (e) => new Error(`User operation failed: ${e}`)
  })
  async addUser(
    username: string,
    email: string,
    phoneNumber: string,
    id?: string
  ): Promise<UserEntity> {
    const user = new UserEntity(username, email, phoneNumber, id);
    return this.create(user);
  }

  protected fromData(data: Partial<UserEntity>): UserEntity {
    return UserEntity.fromData(data);
  }
}


