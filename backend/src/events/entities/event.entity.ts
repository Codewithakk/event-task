// src/events/entities/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('simple-array', { nullable: true })
    images: string[];

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @Column({ nullable: true })
    totalGuests: number;

    @Column({ nullable: true })
    category: string;

    @ManyToOne(() => User, (user) => user.events, { eager: true })
    @JoinColumn({ name: 'organizerId' })
    organizer: User;

    @Column()
    organizerId: number;
}
