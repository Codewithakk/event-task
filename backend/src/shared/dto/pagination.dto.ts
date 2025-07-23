// src/shared/dto/pagination.dto.ts
import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsNumberString()
    page?: number;

    @IsOptional()
    @IsNumberString()
    limit?: number;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsString()
    sortOrder?: 'ASC' | 'DESC';
}
