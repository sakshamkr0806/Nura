import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import { AuthService } from '../auth/auth.service';
import { SubmitOnboardingDto } from './dto/submit-onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
    private authService: AuthService,
  ) {}

  async submitOnboarding(userId: string, dto: SubmitOnboardingDto) {
    const { menstrualHealth, lifestyle, healthHistory, wellnessGoals } = dto;

    // 1. Save or update UserLifestyle
    await this.prisma.userLifestyle.upsert({
      where: { userId },
      update: {
        sleepHours: lifestyle.sleepHours,
        waterIntake: lifestyle.waterIntake,
        activityLevel: lifestyle.activityLevel,
        stressLevel: lifestyle.stressLevel,
        screenTime: lifestyle.screenTime,
      },
      create: {
        userId,
        sleepHours: lifestyle.sleepHours,
        waterIntake: lifestyle.waterIntake,
        activityLevel: lifestyle.activityLevel,
        stressLevel: lifestyle.stressLevel,
        screenTime: lifestyle.screenTime,
      },
    });

    // 2. Save or update UserHealthHistory
    await this.prisma.userHealthHistory.upsert({
      where: { userId },
      update: {
        hasPcos: healthHistory.hasPcos,
        hasThyroid: healthHistory.hasThyroid,
        hasHormonalImbalance: healthHistory.hasHormonalImbalance,
        medications: healthHistory.medications,
      },
      create: {
        userId,
        hasPcos: healthHistory.hasPcos,
        hasThyroid: healthHistory.hasThyroid,
        hasHormonalImbalance: healthHistory.hasHormonalImbalance,
        medications: healthHistory.medications,
      },
    });

    // 3. Save or update UserGoals
    await this.prisma.userGoals.upsert({
      where: { userId },
      update: {
        goals: wellnessGoals.goals,
      },
      create: {
        userId,
        goals: wellnessGoals.goals,
      },
    });

    // 4. Save or update UserSymptoms
    await this.prisma.userSymptoms.upsert({
      where: { userId },
      update: {
        symptoms: menstrualHealth.pmsSymptoms,
        painSeverity: menstrualHealth.painSeverity,
      },
      create: {
        userId,
        symptoms: menstrualHealth.pmsSymptoms,
        painSeverity: menstrualHealth.painSeverity,
      },
    });

    // 5. Initialize user's first cycle based on lastPeriodDate
    const lastPeriodStartDate = new Date(menstrualHealth.lastPeriodDate);
    if (!isNaN(lastPeriodStartDate.getTime())) {
      lastPeriodStartDate.setUTCHours(0, 0, 0, 0);
      const existingCycle = await this.prisma.cycle.findFirst({
        where: {
          userId,
          startDate: lastPeriodStartDate,
        },
      });
      if (!existingCycle) {
        await this.prisma.cycle.create({
          data: {
            userId,
            startDate: lastPeriodStartDate,
          },
        });
      }
    }

    // 6. Update user's onboarding completed status
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
      },
    });

    // 7. Trigger AI service to generate health profile
    const profileData = await this.aiService.generateInitialProfile(dto);

    // 8. Save the generated AI profile
    await this.prisma.healthProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        ...profileData,
        userId,
      },
    });

    // 9. Generate and return new authentication tokens
    const tokens = await this.authService.getTokens(
      updatedUser.id,
      updatedUser.email,
      updatedUser.role,
      updatedUser.fullName,
      updatedUser.phoneNumber ?? undefined,
      updatedUser.dateOfBirth,
      updatedUser.onboardingCompleted,
    );

    await this.authService.updateRtHash(updatedUser.id, tokens.refresh_token);

    return tokens;
  }
}
