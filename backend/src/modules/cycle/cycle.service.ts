import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCycleDto } from './dto/create-cycle.dto';

@Injectable()
export class CycleService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCycleDto) {
    return this.prisma.cycle.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.cycle.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findActive(userId: string) {
    return this.prisma.cycle.findFirst({
      where: {
        userId,
        endDate: null,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async update(id: string, userId: string, dto: Partial<CreateCycleDto>) {
    return this.prisma.cycle.update({
      where: { id, userId },
      data: dto,
    });
  }

  async getPredictions(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    
    const cycles = await this.prisma.cycle.findMany({
      where: { userId, endDate: { not: null } },
      orderBy: { startDate: 'desc' },
      take: 3,
    });

    if (cycles.length === 0) return null;

    const lengths = cycles.map(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate!);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    });

    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const lastCycle = cycles[0];
    const predictedDate = new Date(lastCycle.startDate);
    predictedDate.setDate(predictedDate.getDate() + 28); // Default to 28 days or avg if we have enough data

    return {
      predictedNextPeriod: predictedDate,
      averageCycleLength: avgLength || 28,
    };
  }
}

