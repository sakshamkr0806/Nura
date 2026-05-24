import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async upsert(userId: string, dto: CreateLogDto) {
    const { date, ...data } = dto;
    const logDate = new Date(date);
    logDate.setUTCHours(0, 0, 0, 0);

    const existingLog = await this.prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: logDate,
        },
      },
    });

    if (!existingLog) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const yesterday = new Date(logDate);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setUTCHours(0, 0, 0, 0);

        const yesterdayLog = await this.prisma.dailyLog.findUnique({
          where: {
            userId_date: {
              userId,
              date: yesterday,
            },
          },
        });

        let newStreak = 1;
        if (yesterdayLog) {
          newStreak = user.currentStreak + 1;
        }

        const longest = Math.max(user.longestStreak, newStreak);
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            currentStreak: newStreak,
            longestStreak: longest,
          },
        });
      }
    }

    return this.prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId,
          date: logDate,
        },
      },
      update: data,
      create: {
        ...data,
        date: logDate,
        userId,
      },
    });
  }

  async findByDate(userId: string, date: string) {
    const logDate = new Date(date);
    logDate.setUTCHours(0, 0, 0, 0);

    return this.prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: logDate,
        },
      },
    });
  }

  async findRange(userId: string, start: string, end: string) {
    return this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      orderBy: { date: 'asc' },
    });
  }
}
