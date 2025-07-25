import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto, @Request() req) {
        try {
            return await this.authService.login(req.user);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}