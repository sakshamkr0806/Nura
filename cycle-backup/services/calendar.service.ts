import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isWithinInterval, startOfDay } from 'date-fns';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getCalendarEvents(userId: string, month: number, year: number) {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(start);

    // Fetch periods
    const periods = await this.prisma.periodLog.findMany({
      where: {
        userId,
        OR: [
          { startDate: { lte: end }, endDate: { gte: start } },
          { startDate: { gte: start, lte: end } }
        ]
      }
    });

    // Fetch predictions
    const predictions = await this.prisma.cyclePrediction.findMany({
      where: {
        userId,
        predictedPeriodStart: { gte: start, lte: end }
      },
      orderBy: { predictedPeriodStart: 'desc' },
      take: 1
    });

    const prediction = predictions[0];

    // Fetch daily logs
    const dailyLogs = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: { gte: start, lte: end }
      }
    });

    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const events: string[] = [];
      const dayStart = startOfDay(day);

      // Actual Periods
      const isPeriod = periods.some(p => {
        if (!p.endDate) return dayStart.getTime() >= startOfDay(p.startDate).getTime();
        return isWithinInterval(dayStart, { start: startOfDay(p.startDate), end: startOfDay(p.endDate) });
      });
      if (isPeriod) events.push('period');

      // Predictions
      if (prediction) {
        if (isWithinInterval(dayStart, { start: startOfDay(prediction.predictedPeriodStart), end: startOfDay(prediction.predictedPeriodEnd) })) {
          events.push('predicted_period');
        }
        if (dayStart.getTime() === startOfDay(prediction.predictedOvulationDate).getTime()) {
          events.push('ovulation');
        }
        if (isWithinInterval(dayStart, { start: startOfDay(prediction.fertileStart), end: startOfDay(prediction.fertileEnd) })) {
          events.push('fertile');
        }
        if (isWithinInterval(dayStart, { start: startOfDay(prediction.pmsStart), end: startOfDay(prediction.pmsEnd) })) {
          events.push('pms');
        }
      }

      // Symptoms
      const log = dailyLogs.find(l => format(l.date, 'yyyy-MM-dd') === dateKey);
      if (log && log.symptoms?.length > 0) {
        log.symptoms.forEach(s => events.push(`symptom_${s.toLowerCase().replace(/\\s+/g, '_')}`));
      }

      return {
        date: dateKey,
        events
      };
    });
  }
}
