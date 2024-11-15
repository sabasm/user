import { TypeORMCRUDRepository } from '@smendivil/crud';
import { UserEntity } from '../user/user.entity';
import { Repository, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

export class TypeORMUserRepository extends UserRepository {
    private readonly typeormRepository: Repository<UserEntity>;

    constructor(
        @InjectRepository(UserEntity)
        repository: Repository<UserEntity>
    ) {
        super();
        this.typeormRepository = repository;
    }

    protected async performCreate(entity: UserEntity): Promise<UserEntity> {
        return this.typeormRepository.save(entity);
    }

    protected async performUpdate(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null> {
        const where = { id } as FindOptionsWhere<UserEntity>;
        await this.typeormRepository.update(where, updates);
        return this.performFindById(id);
    }

    protected async performFindById(id: string): Promise<UserEntity | null> {
        return this.typeormRepository.findOne({
            where: { id } as FindOptionsWhere<UserEntity>
        });
    }

    protected async performDelete(id: string): Promise<boolean> {
        const result = await this.typeormRepository.delete({ id } as FindOptionsWhere<UserEntity>);
        return !!result.affected;
    }

    protected async performFindAll(params?: any): Promise<UserEntity[]> {
        return this.typeormRepository.find(params);
    }

    static provideEntity() {
        return {
            provide: 'ICRUDRepository',
            useFactory: (repository: Repository<UserEntity>) => {
                return new TypeORMUserRepository(repository);
            },
            inject: [InjectRepository(UserEntity)],
        };
    }
}


