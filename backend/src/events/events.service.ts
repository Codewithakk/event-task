import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../shared/dto/pagination.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(
        createEventDto: CreateEventDto,
        images: string[],
        userId: number
    ): Promise<Event> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const event = this.eventsRepository.create({
            ...createEventDto,
            images,
            organizer: user,
        });

        return this.eventsRepository.save(event);
    }
    async findAll(paginationDto: PaginationDto, filters: any): Promise<[Event[], number]> {
        const { page = 1, limit = 10, sortBy = 'startDate', sortOrder = 'ASC' } = paginationDto;
        const { name, startDate, endDate, category } = filters;

        const where: any = {};

        if (name) {
            where.name = Like(`%${name}%`);
        }

        if (startDate && endDate) {
            where.startDate = Between(new Date(startDate), new Date(endDate));
        } else if (startDate) {
            where.startDate = MoreThanOrEqual(new Date(startDate));
        } else if (endDate) {
            where.startDate = LessThanOrEqual(new Date(endDate));
        }

        if (category) {
            where.category = category;
        }

        return this.eventsRepository.findAndCount({
            where,
            relations: ['organizer'],
            order: { [sortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(id: number): Promise<Event> {
        const event = await this.eventsRepository.findOne({
            where: { id },
            relations: ['organizer'],
        });
        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }

    async update(id: number, updateEventDto: UpdateEventDto, images: string[], userId: number): Promise<Event> {
        const event = await this.findOne(id);

        if (event.organizer.id !== userId) {
            throw new ForbiddenException('You can only update your own events');
        }

        const updatedEvent = {
            ...event,
            ...updateEventDto,
        };

        if (images && images.length > 0) {
            updatedEvent.images = images;
        }

        return this.eventsRepository.save(updatedEvent);
    }

    async remove(id: number, userId: number): Promise<void> {
        const event = await this.findOne(id);

        if (event.organizer.id !== userId) {
            throw new ForbiddenException('You can only delete your own events');
        }

        await this.eventsRepository.remove(event);
    }

    async searchEvents(keyword: string): Promise<Event[]> {
        return this.eventsRepository.find({
            where: [
                { name: Like(`%${keyword}%`) },
                { description: Like(`%${keyword}%`) },
            ],
            relations: ['organizer'],
        });
    }
}