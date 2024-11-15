import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../src/user/user.entity';
import { UserService } from '../src/user/user.service';
import { InMemoryUserRepository } from '../src/repositories/in-memory.user.repository';
import { DynamicModule } from '@nestjs/common';

describe('UserModule', () => {
    let moduleRef: TestingModule;

    beforeEach(async () => {
        const testModule = {
            module: class TestModule {},
            providers: [
                {
                    provide: 'ICRUDRepository',
                    useClass: InMemoryUserRepository
                },
                UserService
            ]
        };

        moduleRef = await Test.createTestingModule(testModule).compile();
    });

    it('should be defined', () => {
        expect(moduleRef).toBeDefined();
    });

    it('should provide UserService', () => {
        const userService = moduleRef.get<UserService>(UserService);
        expect(userService).toBeDefined();
        expect(userService).toBeInstanceOf(UserService);
    });

    describe('Dynamic Module', () => {
        it('should create proper dynamic module structure', () => {
            const dynamicModule: DynamicModule = UserModule.forRoot();
            
            expect(dynamicModule.module).toBe(UserModule);
            expect(dynamicModule.imports).toEqual([
                TypeOrmModule.forFeature([UserEntity])
            ]);
            expect(dynamicModule.exports).toEqual([UserService]);

            // Type check providers array
            const providers = dynamicModule.providers || [];
            expect(providers).toHaveLength(2);

            // Verify repository provider structure
            const repoProvider = providers[0];
            expect(repoProvider).toEqual({
                provide: 'ICRUDRepository',
                useFactory: expect.any(Function),
                inject: [expect.any(Function)]
            });

            // Verify service provider
            expect(providers[1]).toBe(UserService);
        });
    });

    afterEach(async () => {
        if (moduleRef) {
            await moduleRef.close();
        }
    });
});


