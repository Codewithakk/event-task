// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { User } from './entities/user.entity';

// @Module({
//     imports: [TypeOrmModule.forFeature([User])],
//     controllers: [UsersController],
//     providers: [UsersService],
//     exports: [UsersService],
// })
// export class UsersModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService, AuthService, JwtService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule { }