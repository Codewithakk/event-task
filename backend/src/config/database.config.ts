import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL, // ✅ Use Neon connection string
    ssl: {
        rejectUnauthorized: false, // ✅ Needed for Neon SSL
    },
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: true,
};
