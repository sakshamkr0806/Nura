import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PeriodLog } from '@prisma/client';

@Injectable()
export class CycleComputationService {
  constructor(private prisma: PrismaService) {}

  async calculateCycleStats(userId: string) {
    const periodLogs = await this.prisma.periodLog.findMany({
      where: { userId, endDate: { not: null }, isPredicted: false },
      orderBy: { startDate: 'desc' },
      take: 6,
    });

    if (periodLogs.length === 0) {
      return this.updateOrInsertStats(userId, 28, 5, null, null, false);
    }

    const periodLengths = periodLogs.map((log) => {
      const start = new Date(log.startDate).getTime();
      const end = new Date(log.endDate!).getTime();
      return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    });
    
    const avgPeriodLength =
      periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length;

    let avgCycleLength = 28;
    let shortestCycle: number | null = null;
    let longestCycle: number | null = null;
    let isIrregular = false;

    if (periodLogs.length > 1) {
      const cycleLengths: number[] = [];
      for (let i = 0; i < periodLogs.length - 1; i++) {
        const currentPeriodStart = new Date(periodLogs[i].startDate).getTime();
        const previousPeriodStart = new Date(periodLogs[i + 1].startDate).getTime();
        const diffDays = Math.round(
          (currentPeriodStart - previousPeriodStart) / (1000 * 60 * 60 * 24),
        );
        if (diffDays >= 15 && diffDays <= 60) {
          cycleLengths.push(diffDays);
        }
      }

      if (cycleLengths.length > 0) {
        shortestCycle = Math.min(...cycleLengths);
        longestCycle = Math.max(...cycleLengths);
        const mean = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
        avgCycleLength = mean;

        const variance =
          cycleLengths.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
          cycleLengths.length;
        const stdDev = Math.sqrt(variance);

        isIrregular = stdDev > 7;
      }
    }

    return this.updateOrInsertStats(
      userId,
      Math.round(avgCycleLength),
      Math.round(avgPeriodLength),
      shortestCycle,
      longestCycle,
      isIrregular,
    );
  }

  private async updateOrInsertStats(
    userId: string,
    avgCycleLength: number,
    avgPeriodLength: number,
    shortestCycle: number | null,
    longestCycle: number | null,
    isIrregular: boolean,
  ) {
    return this.prisma.cycleStats.upsert({
      where: { userId },
      update: {
        avgCycleLength,
        avgPeriodLength,
        shortestCycle,
        longestCycle,
        isIrregular,
        lastComputed: new Date(),
      },
      create: {
        userId,
        avgCycleLength,
        avgPeriodLength,
        shortestCycle,
        longestCycle,
        isIrregular,
      },
    });
  }
}
