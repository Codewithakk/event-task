import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards,
    Query,
    UploadedFiles,
    UseInterceptors,
    Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../shared/utils/file-upload.utils';
import { Request } from 'express';

// Extend Express Request interface to include 'user'
declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createEventDto: CreateEventDto,
        @Req() req: Request
    ) {
        try {
            const imagePaths = files?.map(file => file.filename) || [];
            const userId = req.user['userId']; // Get user ID from JWT payload

            return await this.eventsService.create(
                createEventDto,
                imagePaths,
                userId
            );
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }
    @Get()
    async findAll(
        @Query() paginationDto: PaginationDto,
        @Query('name') name: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('category') category: string,
    ) {
        const filters = { name, startDate, endDate, category };
        return this.eventsService.findAll(paginationDto, filters);
    }

    @Get('search')
    async search(@Query('keyword') keyword: string) {
        return this.eventsService.searchEvents(keyword);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.eventsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async update(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() updateEventDto: UpdateEventDto,
        @Req() req: Request,
    ) {
        const imagePaths = files?.map(file => file.filename) || [];
        return this.eventsService.update(+id, updateEventDto, imagePaths, req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req: Request) {
        return this.eventsService.remove(+id, req.user.userId);
    }
}