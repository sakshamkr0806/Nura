import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailyLog, Cycle } from '@prisma/client';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export interface Insight {
  title: string;
  description: string;
  type: string;
}

export interface Recommendation {
  category: string;
  action: string;
  tip: string;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getWellnessScore(userId: string) {
    const last7Days = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(subDays(new Date(), 7)),
          lte: endOfDay(new Date()),
        },
      },
    });

    const cycles = await this.prisma.cycle.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      take: 3,
    });

    // If there is no user data at all in logs or cycles, return 0 for everything
    if (last7Days.length === 0 && cycles.length === 0) {
      return {
        score: 0,
        factors: {
          sleep: 0,
          hydration: 0,
          symptoms: 0,
          cycle: 0,
        },
      };
    }

    // Scoring factors
    const sleepScore = this.calculateSleepScore(last7Days);
    const hydrationScore = this.calculateHydrationScore(last7Days);
    const symptomScore = this.calculateSymptomScore(last7Days);
    const cycleScore = this.calculateCycleScore(cycles);

    // Weighted average
    const totalScore = Math.round(
      sleepScore * 0.25 +
        hydrationScore * 0.15 +
        symptomScore * 0.3 +
        cycleScore * 0.3,
    );

    return {
      score: totalScore,
      factors: {
        sleep: sleepScore,
        hydration: hydrationScore,
        symptoms: symptomScore,
        cycle: cycleScore,
      },
    };
  }

  async getInsights(userId: string) {
    const scoreData = await this.getWellnessScore(userId);
    const insights: Insight[] = [];

    if (scoreData.score === 0) {
      return [
        {
          title: 'Welcome to Nura! 🌱',
          description:
            'Your wellness metrics and personalized trends will appear here as soon as you log your first entry.',
          type: 'info',
        },
      ];
    }

    if (scoreData.factors.sleep < 70) {
      insights.push({
        title: 'Sleep Inconsistency',
        description:
          'Your sleep patterns varied significantly this week. Consistency is key for hormonal balance.',
        type: 'warning',
      });
    } else {
      insights.push({
        title: 'Restful Week',
        description: 'Great job maintaining a steady sleep schedule!',
        type: 'success',
      });
    }

    if (scoreData.factors.hydration < 80) {
      insights.push({
        title: 'Hydration Gap',
        description:
          'You were below your water intake goal on 4 out of 7 days.',
        type: 'info',
      });
    }

    return insights;
  }

  async getRecommendations(userId: string) {
    const scoreData = await this.getWellnessScore(userId);
    const recommendations: Recommendation[] = [];

    if (scoreData.score === 0) {
      return [
        {
          category: 'Wellness',
          action: 'Log your first daily entry',
          tip: 'Start logging your symptoms, sleep, and water intake to get personalised health recommendations! 🌸',
        },
      ];
    }

    if (scoreData.factors.sleep < 80) {
      recommendations.push({
        category: 'Rest',
        action: 'Wind down 30 mins earlier',
        tip: 'Try reading or meditation instead of screens before bed.',
      });
    }

    if (scoreData.factors.hydration < 90) {
      recommendations.push({
        category: 'Nutrition',
        action: 'Drink water first thing in the morning',
        tip: 'Keep a glass of water on your nightstand to start hydrating early.',
      });
    }

    if (scoreData.factors.symptoms < 70) {
      recommendations.push({
        category: 'Activity',
        action: 'Try gentle stretching',
        tip: 'Light movement can help alleviate the discomfort you logged recently.',
      });
    }

    // Default recommendation if none
    if (recommendations.length === 0) {
      recommendations.push({
        category: 'Wellness',
        action: 'Keep up the great routine!',
        tip: 'Consistency is your greatest strength in body literacy.',
      });
    }

    return recommendations;
  }

  async getDashboardMetrics(userId: string) {
    // 1. Cycle Day & Phase
    const activeCycle = await this.prisma.cycle.findFirst({
      where: {
        userId,
        endDate: null,
      },
      orderBy: { startDate: 'desc' },
    });

    let cycleDay = 0;
    let cyclePhase = 'No Active Cycle';
    if (activeCycle) {
      const today = startOfDay(new Date());
      const start = startOfDay(new Date(activeCycle.startDate));
      const diffTime = today.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 0) {
        cycleDay = diffDays;
        // Determine phase based on standard lengths
        if (cycleDay <= 5) {
          cyclePhase = 'Menstrual Phase';
        } else if (cycleDay <= 14) {
          cyclePhase = 'Follicular Phase';
        } else if (cycleDay <= 16) {
          cyclePhase = 'Ovulatory Phase';
        } else {
          cyclePhase = 'Luteal Phase';
        }
      }
    }

    // 2. Next Period & Predicted Date
    const cycles = await this.prisma.cycle.findMany({
      where: { userId, endDate: { not: null } },
      orderBy: { startDate: 'desc' },
      take: 3,
    });

    let nextPeriodDays = 0;
    let predictedDateStr = 'No prediction';

    // Try ended cycles first
    let lastCycleStart = activeCycle?.startDate || null;
    let cycleLength = 28;

    if (cycles.length > 0) {
      const lengths = cycles.map((c) => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate!);
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      });
      cycleLength = Math.round(
        lengths.reduce((a, b) => a + b, 0) / lengths.length,
      );
      lastCycleStart = cycles[0].startDate;
    }

    if (lastCycleStart) {
      const predictedDate = new Date(lastCycleStart);
      predictedDate.setDate(predictedDate.getDate() + cycleLength);

      const today = startOfDay(new Date());
      const predStart = startOfDay(predictedDate);
      const diffTime = predStart.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        nextPeriodDays = diffDays;
        predictedDateStr = `Predicted: ${predictedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else {
        nextPeriodDays = 0;
        predictedDateStr = 'Delayed';
      }
    }

    // 3. Avg Sleep & Water Intake (last 7 days)
    const last7Days = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(subDays(new Date(), 7)),
          lte: endOfDay(new Date()),
        },
      },
    });

    const sleepLogs = last7Days.filter(
      (log) => log.sleepHours !== null && log.sleepHours !== undefined,
    );
    const avgSleep =
      sleepLogs.length > 0
        ? Math.round(
            (sleepLogs.reduce((acc, log) => acc + log.sleepHours!, 0) /
              sleepLogs.length) *
              10,
          ) / 10
        : 0;

    const waterLogs = last7Days.filter(
      (log) => log.waterIntake !== null && log.waterIntake !== undefined,
    );
    const avgWater =
      waterLogs.length > 0
        ? Math.round(
            (waterLogs.reduce((acc, log) => acc + log.waterIntake!, 0) /
              waterLogs.length) *
              10,
          ) / 10
        : 0;

    return {
      cycleDay,
      cyclePhase,
      nextPeriodDays,
      predictedDate: predictedDateStr,
      avgSleep,
      avgWater,
    };
  }

  private calculateSleepScore(logs: DailyLog[]) {
    if (logs.length === 0) return 0;
    const avgSleep =
      logs.reduce((acc, log) => acc + (log.sleepHours || 0), 0) / logs.length;
    // Goal: 8 hours
    const score = (avgSleep / 8) * 100;
    return Math.min(100, Math.round(score));
  }

  private calculateHydrationScore(logs: DailyLog[]) {
    if (logs.length === 0) return 0;
    const avgHydration =
      logs.reduce((acc, log) => acc + (log.waterIntake || 0), 0) / logs.length;

    if (avgHydration >= 2000) return 100;
    if (avgHydration >= 1500) return 75;
    if (avgHydration >= 1000) return 50;
    if (avgHydration >= 500) return 25;
    return 0;
  }

  private calculateSymptomScore(logs: DailyLog[]) {
    if (logs.length === 0) return 100; // No symptoms is good
    const symptomDays = logs.filter(
      (log) => log.symptoms && log.symptoms.length > 0,
    ).length;
    const score = 100 - (symptomDays / 7) * 100;
    return Math.max(0, Math.round(score));
  }

  private calculateCycleScore(cycles: Cycle[]) {
    if (cycles.length < 2) return 80; // Not enough data, default to good
    // Simplified: check if last 2 cycles have similar length (e.g., within 2 days)
    // For now, return a placeholder based on data presence
    return 90;
  }
}
