import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetCurrentUserId } from '../../common/decorators';
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';

@Controller('logs')
export class LogController {
  constructor(private logService: LogService) {}

  @Post()
  upsert(@GetCurrentUserId() userId: string, @Body() dto: CreateLogDto) {
    return this.logService.upsert(userId, dto);
  }

  @Get('by-date')
  findByDate(@GetCurrentUserId() userId: string, @Query('date') date: string) {
    return this.logService.findByDate(userId, date);
  }

  @Get('range')
  findRange(
    @GetCurrentUserId() userId: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.logService.findRange(userId, start, end);
  }
}
