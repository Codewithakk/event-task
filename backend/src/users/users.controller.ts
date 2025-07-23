import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const { user, accessToken } = await this.usersService.validateUser(loginUserDto);
        return {
            access_token: accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return this.usersService.findOne(req.user.userId);
    }
}