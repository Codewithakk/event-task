import { Injectable } from '@nestjs/common';
import { UserSeedService } from './user.seed';

@Injectable()
export class DatabaseSeedService {
    constructor(
        private readonly userSeedService: UserSeedService,
    ) { }

    async run() {
        await this.userSeedService.run();
    }
}