
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DATABASE_URL: Joi.string().uri().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRES_IN: Joi.string().default('3600s'),
            }),
        }),
    ],
})
export class ConfigModule { }
