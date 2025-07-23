// src/events/dto/create-event.dto.ts
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;

    @IsNumber()
    @IsOptional()
    totalGuests?: number;

    @IsString()
    @IsOptional()
    category?: string;
}
