import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService, AIHealthProfileResponse } from '../ai/ai.service';
import { AuthService } from '../auth/auth.service';
import { SubmitOnboardingDto } from './dto/submit-onboarding.dto';
import { SaveOnboardingStepDto } from './dto/save-onboarding-step.dto';

import { Prisma } from '@prisma/client';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
    private authService: AuthService,
  ) {}

  async submitOnboarding(userId: string, dto: SubmitOnboardingDto) {
    const {
      menstrualHealth,
      lifestyle,
      healthHistory,
      wellnessGoals,
      personalDetails,
    } = dto;

    if (!personalDetails) {
      throw new BadRequestException('Personal details are required');
    }

    const dob = new Date(personalDetails.dateOfBirth);
    if (isNaN(dob.getTime())) {
      throw new BadRequestException('Invalid date of birth');
    }
    const today = new Date();
    const thirteenYearsAgo = new Date(
      today.getFullYear() - 13,
      today.getMonth(),
      today.getDate(),
    );
    if (dob > thirteenYearsAgo) {
      throw new BadRequestException('You must be at least 13 years old');
    }

    if (personalDetails.phoneNumber) {
      const existingPhone = await this.prisma.user.findFirst({
        where: {
          phoneNumber: personalDetails.phoneNumber,
          NOT: { id: userId },
        },
      });
      if (existingPhone) {
        throw new ConflictException(
          'An account with this phone number already exists',
        );
      }
    }

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

    // 6. Update user's onboarding completed status, dateOfBirth, and phoneNumber
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        dateOfBirth: dob,
        phoneNumber: personalDetails.phoneNumber || null,
      },
    });

    // 7. Trigger AI service to generate health profile with a timeout of 12 seconds
    let profileData: AIHealthProfileResponse | null = null;
    let isFallback = false;

    // Start the AI profile generation promise (only ONE call is made)
    const aiGenerationPromise = this.aiService.generateInitialProfile(dto);

    // Save the result in the background whenever the promise eventually resolves
    aiGenerationPromise
      .then(async (realProfile) => {
        try {
          await this.prisma.healthProfile.upsert({
            where: { userId },
            update: realProfile,
            create: {
              ...realProfile,
              userId,
            },
          });
          this.logger.log(
            `AI profile successfully saved from background worker/promise for user ${userId}`,
          );
        } catch (dbErr) {
          this.logger.error(
            `Failed to save background AI profile for user ${userId}:`,
            dbErr,
          );
        }
      })
      .catch((err) => {
        this.logger.error(
          `Background AI profile promise failed for user ${userId}:`,
          err,
        );
      });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out')), 12000),
    );

    try {
      profileData = await Promise.race([aiGenerationPromise, timeoutPromise]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `AI initial profile generation failed or timed out: ${errMsg}. Using fallback data for immediate response.`,
      );
      isFallback = true;
    }

    if (isFallback || !profileData) {
      profileData = {
        wellnessScore: 70,
        cycleHealthScore: 70,
        sleepScore: 70,
        stressScore: 70,
        stressIndicator: 'Moderate',
        sleepAnalysis: 'Profile created! AI insights will load shortly.',
        stressAnalysis: 'Profile created! AI insights will load shortly.',
        cycleInsights: 'Profile created! AI insights will load shortly.',
        hydrationRecs: ['Aim for 2-3 liters of water daily'],
        nutritionRecs: ['Prioritize nutrient-dense whole foods'],
        actionPlan: ['Log symptoms daily in the calendar'],
        dailyRecs: ['Perform 5 minutes of deep breathing'],
      };
    }

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

  async saveStep(userId: string, dto: SaveOnboardingStepDto) {
    const { step, basicInfo, cycleTracking, symptomPreferences, healthGoals } =
      dto;

    const data: Prisma.UserUpdateInput = {
      lastCompletedStep: step,
      profileStatus: 'INCOMPLETE',
    };

    if (basicInfo) {
      if (basicInfo.fullName) data.fullName = basicInfo.fullName;
      if (basicInfo.age) data.age = basicInfo.age;
      if (basicInfo.height) data.height = basicInfo.height;
      if (basicInfo.weight) data.weight = basicInfo.weight;
    }

    if (symptomPreferences) {
      const symptoms: string[] = [];
      if (symptomPreferences.trackCramps) symptoms.push('Cramps');
      if (symptomPreferences.trackMood) symptoms.push('Mood Swings');
      if (symptomPreferences.trackEnergy) symptoms.push('Fatigue');
      if (symptomPreferences.trackBloating) symptoms.push('Bloating');

      await this.prisma.userSymptoms.upsert({
        where: { userId },
        update: { symptoms },
        create: { userId, symptoms, painSeverity: 'Moderate' },
      });
    }

    if (healthGoals && healthGoals.primaryGoal) {
      await this.prisma.userGoals.upsert({
        where: { userId },
        update: { goals: [healthGoals.primaryGoal] },
        create: { userId, goals: [healthGoals.primaryGoal] },
      });
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    if (cycleTracking && cycleTracking.lastPeriodDate) {
      const lastPeriodStartDate = new Date(cycleTracking.lastPeriodDate);
      if (!isNaN(lastPeriodStartDate.getTime())) {
        lastPeriodStartDate.setUTCHours(0, 0, 0, 0);
        const existingCycle = await this.prisma.cycle.findFirst({
          where: { userId, startDate: lastPeriodStartDate },
        });
        if (!existingCycle) {
          await this.prisma.cycle.create({
            data: { userId, startDate: lastPeriodStartDate },
          });
        }
      }
    }

    return user;
  }

  async completeOnboarding(userId: string) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        profileStatus: 'COMPLETE',
      },
    });

    const tokens = await this.authService.getTokens(
      updatedUser.id,
      updatedUser.email,
      updatedUser.role,
      updatedUser.fullName,
      updatedUser.phoneNumber ?? undefined,
      updatedUser.dateOfBirth,
      updatedUser.onboardingCompleted,
      updatedUser.profileStatus,
      updatedUser.lastCompletedStep,
    );

    await this.authService.updateRtHash(updatedUser.id, tokens.refresh_token);

    return tokens;
  }
}
