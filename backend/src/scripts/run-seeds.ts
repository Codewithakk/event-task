// src/scripts/run-seeds.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Event } from '../events/entities/event.entity'; // Import Event entity
import * as dotenv from 'dotenv';

dotenv.config();

// Create a new DataSource instance with your configuration
const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Event], // Include both User and Event entities
    synchronize: false,
});

async function seedDatabase() {
    try {
        await dataSource.initialize();
        console.log('Database connection established');

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
            console.log('Database seeded successfully!');
        } else {
            console.log('Database already contains data - skipping seeding');
        }
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('Database connection closed');
        }
    }
}

seedDatabase();