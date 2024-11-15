import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { TypeORMUserRepository } from '../repositories/typeorm.user.repository';
import { UserService } from './user.service';

@Module({})
export class UserModule {
    static forRoot(): DynamicModule {
        return {
            module: UserModule,
            imports: [TypeOrmModule.forFeature([UserEntity])],
            providers: [
                TypeORMUserRepository.provideEntity(),
                UserService
            ],
            exports: [UserService],
        };
    }
}


