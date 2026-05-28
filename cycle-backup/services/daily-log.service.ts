import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDailyLogDto } from '../dto/daily-log.dto';
import { startOfDay } from 'date-fns';

@Injectable()
export class DailyLogService {
  constructor(private prisma: PrismaService) {}

  async upsertDailyLog(userId: string, dto: CreateDailyLogDto) {
    const date = startOfDay(new Date(dto.date));
    
    return this.prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        ...dto,
        date,
      },
      create: {
        userId,
        ...dto,
        date,
      },
    });
  }

  async getLogByDate(userId: string, dateStr: string) {
    const date = startOfDay(new Date(dateStr));
    return this.prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });
  }
}
