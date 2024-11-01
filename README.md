# @smendivil/user
A robust, scalable, and reusable User module for Node.js applications, designed to be ORM-agnostic and easily integrated with various data storage solutions like TypeORM, Prisma, or in-memory storage.

## Features
- UserEntity: A base user entity class that can be extended or used as-is.
- UserService: A service class that provides CRUD operations for UserEntity.
- Repository Pattern: An interface and abstract class for repositories, allowing for custom implementations.
- In-Memory Repository: An in-memory implementation of the repository for testing or simple applications.
- TypeORM Repository: An implementation using TypeORM for relational databases.
- ORM-Agnostic: The module is designed to work with any ORM or database solution.

## Installation
npm install @smendivil/user

## Usage
### Setting Up in a NestJS Application
1. Install Dependencies
npm install @smendivil/user @nestjs/typeorm typeorm

2. Configure TypeORM
ormconfig.ts or data-source.ts
import { UserEntity } from '@smendivil/user';
export default { type: 'postgres', host: 'localhost', port: 5432, username: 'your-username', password: 'your-password', database: 'your-database', entities: [UserEntity], synchronize: true };

3. Create User Module
>src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserService, TypeORMUserRepository } from '@smendivil/user';
@Module({ imports: [TypeOrmModule.forFeature([UserEntity])], providers: [{ provide: 'IUserRepository', useClass: TypeORMUserRepository }, { provide: UserService, useFactory: (userRepository) => new UserService(userRepository), inject: ['IUserRepository'] }], exports: [UserService] })
export class UserModule {}

4. Create User Controller
>src/user/user.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from '@smendivil/user';
@Controller('users')
export class UserController { constructor(private readonly userService: UserService) {} @Post() async createUser(@Body() createUserDto) { const { username, email, phoneNumber } = createUserDto; return await this.userService.addUser(username, email, phoneNumber); } @Get() async getAllUsers() { return await this.userService.getAllUsers(); } @Get(':id') async getUserById(@Param('id') id: string) { return await this.userService.getUserById(id); } }

5. Import User Module
>src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from '../ormconfig';
import { UserModule } from './user/user.module';
@Module({ imports: [TypeOrmModule.forRoot(ormConfig), UserModule] })
export class AppModule {}

### Setting Up in a Next.js Application
1. Install Dependencies
npm install @smendivil/user

2. Create API Route
>pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { UserService, InMemoryUserRepository } from '@smendivil/user';
const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);
export default async (req: NextApiRequest, res: NextApiResponse) => { if (req.method === 'POST') { const { username, email, phoneNumber } = req.body; const user = await userService.addUser(username, email, phoneNumber); res.status(201).json(user); } else if (req.method === 'GET') { const users = await userService.getAllUsers(); res.status(200).json(users); } else { res.status(405).end(); } };

3. Create a Page to Display Users
>pages/users.tsx
import { useState, useEffect } from 'react';
import { UserEntity } from '@smendivil/user';
const UsersPage = () => { const [users, setUsers] = useState<UserEntity[]>([]); useEffect(() => { fetch('/api/users').then((res) => res.json()).then((data) => { const userEntities = data.map((userData: Partial<UserEntity>) => UserEntity.fromData(userData)); setUsers(userEntities); }); }, []); return (<div> <h1>User List</h1> <ul> {users.map((user) => (<li key={user.id}>{user.getEntityDetails()}</li>))} </ul> </div>); };
export default UsersPage;

## Testing
To run the tests:
npm run test

## Building and Publishing
To build the package:
npm run build

To publish the package to npm (ensure you're logged in and have the correct permissions):
npm publish --access public

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

