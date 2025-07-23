import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
}