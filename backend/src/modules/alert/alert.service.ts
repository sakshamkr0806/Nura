import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertLevel } from '@prisma/client';
import { subDays, differenceInDays } from 'date-fns';

@Injectable()
export class AlertService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.alert.update({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async evaluateRules(userId: string) {
    const alerts = [];
    
    // 1. Cycle Delay Rule
    const activeCycle = await this.prisma.cycle.findFirst({
      where: { userId, endDate: null },
      orderBy: { startDate: 'desc' },
    });

    if (activeCycle) {
      const daysDiff = differenceInDays(new Date(), activeCycle.startDate);
      if (daysDiff > 35) { // Assuming 35 days as a general threshold for delay alert
        alerts.push({
          title: 'Cycle Delay Detected',
          message: 'Your current cycle has exceeded 35 days. This is for educational awareness and is NOT a medical diagnosis. Please consult a healthcare professional for persistent concerns.',
          level: AlertLevel.MEDICAL_SUGGESTION,
        });
      }
    }

    // 2. Heavy Symptoms Rule
    const recentLogs = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: { gte: subDays(new Date(), 3) },
      },
    });

    const heavySymptomsCount = recentLogs.filter(log => 
      log.symptoms.includes('Heavy Bleeding') || log.symptoms.length > 3
    ).length;

    if (heavySymptomsCount >= 2) {
      alerts.push({
        title: 'Increased Symptom Intensity',
        message: 'We noticed a pattern of heavy symptoms over the last 3 days. Focus on rest and hydration.',
        level: AlertLevel.ATTENTION,
      });
    }

    // 3. Hydration Rule
    const lowHydrationCount = recentLogs.filter(log => (log.waterIntake || 0) < 1500).length;
    if (lowHydrationCount >= 2) {
      alerts.push({
        title: 'Hydration Goal Missed',
        message: 'Your water intake has been low lately. Staying hydrated is essential for hormonal health.',
        level: AlertLevel.INFO,
      });
    }

    // Persist new alerts (avoiding duplicates if already existing within same day)
    for (const alert of alerts) {
      const existing = await this.prisma.alert.findFirst({
        where: {
          userId,
          title: alert.title,
          createdAt: { gte: subDays(new Date(), 1) }
        }
      });

      if (!existing) {
        await this.prisma.alert.create({
          data: { ...alert, userId },
        });
      }
    }

    return alerts;
  }

  async delete(id: string, userId: string) {
    return this.prisma.alert.delete({
      where: { id, userId },
    });
  }
}
