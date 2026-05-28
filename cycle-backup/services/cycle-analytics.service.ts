import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CycleComputationService } from './cycle-computation.service';

@Injectable()
export class CycleAnalyticsService {
  constructor(
    private prisma: PrismaService,
    private computation: CycleComputationService
  ) {}

  async getAnalytics(userId: string) {
    const stats = await this.computation.calculateCycleStats(userId);
    
    const dailyLogs = await this.prisma.dailyLog.findMany({
      where: { userId },
    });
    
    const symptomCounts: Record<string, number> = {};
    let missedPeriods = 0;

    dailyLogs.forEach(log => {
      log.symptoms?.forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      });
    });

    const mostCommonSymptom = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const lastPeriod = await this.prisma.periodLog.findFirst({
        where: { userId },
        orderBy: { startDate: 'desc' }
    });
    
    if (lastPeriod && (new Date().getTime() - new Date(lastPeriod.startDate).getTime()) > 60 * 24 * 60 * 60 * 1000) {
        missedPeriods = 1;
    }

    return {
      averageCycleLength: stats.avgCycleLength,
      averagePeriodLength: stats.avgPeriodLength,
      shortestCycle: stats.shortestCycle,
      longestCycle: stats.longestCycle,
      isIrregular: stats.isIrregular,
      mostCommonSymptom,
      symptomFrequency: symptomCounts,
      missedPeriods
    };
  }

  async getReportData(userId: string) {
     const analytics = await this.getAnalytics(userId);
     const periods = await this.prisma.periodLog.findMany({ where: { userId }, orderBy: { startDate: 'desc' }, take: 6 });
     
     return {
        patientId: userId,
        reportGeneratedAt: new Date(),
        analytics,
        recentCycles: periods
     };
  }
}
