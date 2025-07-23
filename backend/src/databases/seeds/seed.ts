// src/database/seeds/seed.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';

export async function seedDatabase(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);

    const count = await userRepository.count();
    if (count === 0) {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash('password123', salt);

        await userRepository.save(
            userRepository.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password,
            })
        );
        console.log('Database seeded!');
    }
}