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

    const lengths = cycles.map((c) => {
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

  getSeedRecommendation(startDateStr: string | Date, cycleLength: number = 28) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let cycleDay = ((diffDays - 1) % cycleLength) + 1;
    if (cycleDay < 1) cycleDay = 1;

    let phase: string;
    let recommendedSeeds: string[];
    let nextPhase: {
      phase: string;
      daysUntil: number;
      recommendedSeeds: string[];
    } | null = null;

    if (cycleDay <= 5) {
      phase = 'Menstrual';
      recommendedSeeds = ['Flax seeds', 'Pumpkin seeds'];
      nextPhase = {
        phase: 'Follicular',
        daysUntil: 6 - cycleDay,
        recommendedSeeds: ['Sesame seeds', 'Sunflower seeds'],
      };
    } else if (cycleDay <= 13) {
      phase = 'Follicular';
      recommendedSeeds = ['Sesame seeds', 'Sunflower seeds'];
      nextPhase = {
        phase: 'Ovulation',
        daysUntil: 14 - cycleDay,
        recommendedSeeds: ['Pumpkin seeds', 'Sunflower seeds'],
      };
    } else if (cycleDay <= 16) {
      phase = 'Ovulation';
      recommendedSeeds = ['Pumpkin seeds', 'Sunflower seeds'];
      nextPhase = {
        phase: 'Luteal',
        daysUntil: 17 - cycleDay,
        recommendedSeeds: ['Flax seeds', 'Sesame seeds'],
      };
    } else {
      phase = 'Luteal';
      recommendedSeeds = ['Flax seeds', 'Sesame seeds'];
      nextPhase = {
        phase: 'Menstrual',
        daysUntil: cycleLength - cycleDay + 1,
        recommendedSeeds: ['Flax seeds', 'Pumpkin seeds'],
      };
    }

    return {
      phase,
      day: cycleDay,
      recommendedSeeds,
      nextPhase,
    };
  }

  async getUserSeedRecommendation(userId: string) {
    const activeCycle = await this.findActive(userId);
    let startDate: Date | null = null;

    if (activeCycle) {
      startDate = new Date(activeCycle.startDate);
    } else {
      const lastCycle = await this.prisma.cycle.findFirst({
        where: { userId },
        orderBy: { startDate: 'desc' },
      });
      if (lastCycle) {
        startDate = new Date(lastCycle.startDate);
      }
    }

    if (!startDate) {
      return {
        phase: null,
        day: null,
        recommendedSeeds: [],
        nextPhase: null,
      };
    }

    let cycleLength = 28;
    const predictions = await this.getPredictions(userId);
    if (predictions && predictions.averageCycleLength) {
      cycleLength = Math.round(predictions.averageCycleLength);
    }

    return this.getSeedRecommendation(startDate, cycleLength);
  }
}
