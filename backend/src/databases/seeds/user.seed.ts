import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeedService {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) { }

    async run() {
        const count = await this.repository.count();

        if (count === 0) {
            const salt = await bcrypt.genSalt();
            const password = await bcrypt.hash('password123', salt);

            await this.repository.save(
                this.repository.create({
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password,
                }),
            );
        }
    }
}