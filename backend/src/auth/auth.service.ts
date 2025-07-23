// import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
// import { User } from '../users/entities/user.entity';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//     constructor(
//         private usersService: UsersService,
//         private jwtService: JwtService,
//     ) { }

//     async validateUser(email: string, password: string): Promise<any> {
//         try {
//             const user = await this.usersService.findOneByEmail(email);
//             if (!user) {
//                 throw new UnauthorizedException('Invalid credentials');
//             }

//             const isPasswordValid = await bcrypt.compare(password, user.password);
//             if (!isPasswordValid) {
//                 throw new UnauthorizedException('Invalid credentials');
//             }

//             return user;
//         } catch (error) {
//             console.error('Database error during validation:', error);
//             throw new InternalServerErrorException('Authentication failed');
//         }
//     }
//     async login(user: User) {
//         const payload = { email: user.email, sub: user.id };
//         return {
//             access_token: this.jwtService.sign(payload),
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email
//             }
//         };
//     }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(user: User) {
        try {
            const payload = {
                email: user.email,
                sub: user.id,
                name: user.name
            };

            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            };
        } catch (error) {
            console.error('JWT signing error:', error);
            throw new Error('Failed to generate access token');
        }
    }
}