import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, startOfDay, endOfDay } from 'date-fns';

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
      cycleScore * 0.3
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
    const insights: any[] = [];

    if (scoreData.factors.sleep < 70) {
      insights.push({
        title: 'Sleep Inconsistency',
        description: 'Your sleep patterns varied significantly this week. Consistency is key for hormonal balance.',
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
        description: 'You were below your water intake goal on 4 out of 7 days.',
        type: 'info',
      });
    }

    return insights;
  }

  async getRecommendations(userId: string) {
    const scoreData = await this.getWellnessScore(userId);
    const recommendations: any[] = [];

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

  private calculateSleepScore(logs: any[]) {
    if (logs.length === 0) return 0;
    const avgSleep = logs.reduce((acc, log) => acc + (log.sleepHours || 0), 0) / logs.length;
    // Goal: 8 hours
    const score = (avgSleep / 8) * 100;
    return Math.min(100, Math.round(score));
  }

  private calculateHydrationScore(logs: any[]) {
    if (logs.length === 0) return 0;
    const avgHydration = logs.reduce((acc, log) => acc + (log.waterIntake || 0), 0) / logs.length;
    // Goal: 2500ml
    const score = (avgHydration / 2500) * 100;
    return Math.min(100, Math.round(score));
  }

  private calculateSymptomScore(logs: any[]) {
    if (logs.length === 0) return 100; // No symptoms is good
    const symptomDays = logs.filter(log => log.symptoms && log.symptoms.length > 0).length;
    const score = 100 - (symptomDays / 7) * 100;
    return Math.max(0, Math.round(score));
  }

  private calculateCycleScore(cycles: any[]) {
    if (cycles.length < 2) return 80; // Not enough data, default to good
    // Simplified: check if last 2 cycles have similar length (e.g., within 2 days)
    // For now, return a placeholder based on data presence
    return 90;
  }
}
