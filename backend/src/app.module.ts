import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from './config/configuration';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';
import { DatabaseSeedService } from './databases/seeds/database.seed';
import { UserSeedService } from './databases/seeds/user.seed';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(databaseConfig),
    MulterModule.register({
      dest: './uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    AuthModule,
    EventsModule,
    TypeOrmModule.forFeature([User]), // Add this for seeding
  ],
  providers: [
    DatabaseSeedService,
    UserSeedService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedService: DatabaseSeedService) { }

  async onApplicationBootstrap() {
    await this.seedService.run();
  }
}