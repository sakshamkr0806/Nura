import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CycleComputationService } from './cycle-computation.service';
import { addDays, differenceInDays } from 'date-fns';

@Injectable()
export class PredictionService {
  constructor(
    private prisma: PrismaService,
    private computationService: CycleComputationService,
  ) {}

  async generatePrediction(userId: string) {
    const stats = await this.computationService.calculateCycleStats(userId);
    
    const lastPeriod = await this.prisma.periodLog.findFirst({
      where: { userId, isPredicted: false },
      orderBy: { startDate: 'desc' },
    });

    if (!lastPeriod) {
      return null;
    }

    const cycleLength = Math.round(stats.avgCycleLength);
    const lastStartDate = new Date(lastPeriod.startDate);
    
    // Core predictions
    const predictedPeriodStart = addDays(lastStartDate, cycleLength);
    const predictedPeriodEnd = addDays(predictedPeriodStart, Math.round(stats.avgPeriodLength));
    const predictedOvulationDate = addDays(predictedPeriodStart, -14);
    const fertileStart = addDays(predictedOvulationDate, -5);
    const fertileEnd = predictedOvulationDate;
    const pmsStart = addDays(predictedPeriodStart, -7);
    const pmsEnd = addDays(predictedPeriodStart, -1);

    const historyCount = await this.prisma.periodLog.count({
      where: { userId, isPredicted: false },
    });

    let confidenceScore = 'Low';
    if (historyCount >= 6 && !stats.isIrregular) confidenceScore = 'High';
    else if (historyCount >= 3) confidenceScore = 'Medium';

    const isLate = differenceInDays(new Date(), predictedPeriodStart) > 3;

    return this.prisma.cyclePrediction.create({
      data: {
        userId,
        predictedPeriodStart,
        predictedPeriodEnd,
        predictedOvulationDate,
        fertileStart,
        fertileEnd,
        pmsStart,
        pmsEnd,
        cycleLengthUsed: cycleLength,
        confidenceScore,
        isLate,
      },
    });
  }
}
