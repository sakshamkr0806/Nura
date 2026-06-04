import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';

export interface AIHealthProfileResponse {
  wellnessScore: number;
  cycleHealthScore: number;
  sleepScore: number;
  stressScore: number;
  stressIndicator: string;
  sleepAnalysis: string;
  stressAnalysis: string;
  cycleInsights: string;
  hydrationRecs: string[];
  nutritionRecs: string[];
  actionPlan: string[];
  dailyRecs: string[];
}

export interface GeminiErrorDetails {
  '@type'?: string;
  retryDelay?: string;
  links?: Array<{ description: string; url: string }>;
  violations?: Array<{
    quotaMetric?: string;
    quotaId?: string;
    quotaDimensions?: Record<string, string>;
  }>;
}

export interface GeminiErrorResponse {
  status?: number;
  statusCode?: number;
  message?: string;
  errorDetails?: GeminiErrorDetails[];
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private genAI: GoogleGenerativeAI;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.genAI = new GoogleGenerativeAI(
      this.config.get<string>('GEMINI_API_KEY') || '',
    );
  }

  async generateInsights(userId: string) {
    const context = await this.getUserContext(userId);

    const prompt = `
      You are a Wellness Coach for a woman using CycleWell, a hormonal wellness app.
      Based on the following 7-day data, provide a personalized wellness summary.
      
      RULES:
      1. DO NOT provide medical diagnoses.
      2. DO NOT suggest cures for diseases.
      3. Focus on education, lifestyle habits, and encouragement.
      4. Keep the tone empathetic and professional.
      5. Output ONLY raw JSON format with fields: "summary" (string), "recommendations" (array of strings), "educationalNote" (string). DO NOT wrap in markdown code blocks.

      DATA:
      ${JSON.stringify(context, null, 2)}
    `;

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await this.callWithRetry(() =>
        model.generateContent(prompt),
      );
      const responseText = result.response.text();
      return JSON.parse(responseText || '{}') as Record<string, unknown>;
    } catch (error) {
      this.logger.error('Gemini Error:', error);
      return {
        summary:
          'We are unable to generate personalized insights right now, but keep up your consistent logging!',
        recommendations: ['Maintain a regular sleep schedule', 'Stay hydrated'],
        educationalNote:
          'Consistency in logging helps identify patterns over time.',
      };
    }
  }

  async generateInitialProfile(
    onboardingData: any,
  ): Promise<AIHealthProfileResponse> {
    const prompt = `
      You are an expert AI Wellness Coach for a woman using CycleWell, a hormonal wellness app.
      Based on the following onboarding responses, generate a comprehensive personalized health profile.
      
      RULES:
      1. DO NOT provide medical diagnoses.
      2. DO NOT suggest cures for diseases.
      3. Focus on education, lifestyle habits, and encouragement.
      4. Keep the tone empathetic, professional, and warm.
      5. Output ONLY raw JSON format matching the specified schema. DO NOT wrap in markdown code blocks.

      SCHEMA:
      {
        "wellnessScore": number (1-100),
        "cycleHealthScore": number (1-100),
        "sleepScore": number (1-100),
        "stressScore": number (1-100),
        "stressIndicator": "Low" | "Moderate" | "High",
        "sleepAnalysis": "string (detailed educational analysis of reported sleep habits)",
        "stressAnalysis": "string (detailed educational analysis of reported stress levels)",
        "cycleInsights": "string (detailed insights based on symptoms, pain severity, and cycle regularity)",
        "hydrationRecs": ["array of strings (hydration habits advice)"],
        "nutritionRecs": ["array of strings (nutritional habits advice based on symptoms/goals)"],
        "actionPlan": ["array of strings (action items for goals)"],
        "dailyRecs": ["array of strings (daily micro-habits recommendations)"]
      }

      DATA:
      ${JSON.stringify(onboardingData, null, 2)}
    `;

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await this.callWithRetry(() =>
        model.generateContent(prompt),
      );
      const responseText = result.response.text();
      return JSON.parse(responseText || '{}') as AIHealthProfileResponse;
    } catch (error) {
      this.logger.error('Gemini Initial Profile Error:', error);
      return {
        wellnessScore: 70,
        cycleHealthScore: 70,
        sleepScore: 70,
        stressScore: 70,
        stressIndicator: 'Moderate',
        sleepAnalysis:
          'Based on your reported sleep, maintaining a consistent routine is key.',
        stressAnalysis: 'Mindfulness and gentle yoga can help balance stress.',
        cycleInsights:
          'Tracking your cycle regularly will help identify your patterns.',
        hydrationRecs: [
          'Drink 2-3 liters of water daily',
          'Start your day with a glass of warm water',
        ],
        nutritionRecs: [
          'Prioritize nutrient-dense whole foods',
          'Include healthy fats for hormone synthesis',
        ],
        actionPlan: [
          'Log symptoms daily in the calendar',
          'Establish a consistent wind-down routine',
        ],
        dailyRecs: [
          'Perform 5 minutes of deep breathing',
          'Drink water before reaching for caffeine',
        ],
      };
    }
  }

  async getHealthProfile(userId: string) {
    const profile = await this.prisma.healthProfile.findUnique({
      where: { userId },
    });

    if (profile) return profile;

    // Return a default placeholder so the Dashboard always renders the wellness section
    return {
      wellnessScore: 0,
      cycleHealthScore: 0,
      sleepScore: 0,
      stressScore: 0,
      stressIndicator: 'Unknown',
      sleepAnalysis:
        'Start logging your daily data so we can analyze your sleep patterns.',
      stressAnalysis:
        'Log your moods and symptoms daily to get a personalized stress analysis.',
      cycleInsights:
        'Track your cycle and symptoms consistently to unlock AI-powered insights.',
      hydrationRecs: [
        'Aim for 2-3 liters of water daily',
        'Start your morning with a glass of warm water',
      ],
      nutritionRecs: [
        'Eat a balanced diet rich in whole foods',
        'Include iron-rich foods during your period',
      ],
      actionPlan: [
        'Log your symptoms daily in the calendar',
        'Click "Refresh AI Insights" after a few days of logging',
      ],
      dailyRecs: [
        'Drink a glass of water first thing in the morning',
        'Take a 5-minute breathing break',
      ],
    };
  }

  async reAnalyzeProfile(userId: string) {
    const context = await this.getUserContext(userId);
    const onboarding = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        lifestyle: true,
        healthHistory: true,
        goals: true,
        symptoms: true,
      },
    });

    const prompt = `
      You are an expert AI Wellness Coach for a woman using CycleWell, a hormonal wellness app.
      Based on the user's initial onboarding profile AND their last 7 days of daily tracking data, generate an updated wellness analysis.
      Identify any patterns, improvements, or areas of concern (e.g. sleep inconsistencies, hydration drops, stress trends) and update their scores and recommendations.
      
      RULES:
      1. DO NOT provide medical diagnoses.
      2. DO NOT suggest cures for diseases.
      3. Focus on education, lifestyle habits, and encouragement.
      4. Keep the tone empathetic and professional.
      5. Output ONLY raw JSON format matching the specified schema. DO NOT wrap in markdown code blocks.

      SCHEMA:
      {
        "wellnessScore": number (1-100),
        "cycleHealthScore": number (1-100),
        "sleepScore": number (1-100),
        "stressScore": number (1-100),
        "stressIndicator": "Low" | "Moderate" | "High",
        "sleepAnalysis": "string (updated sleep analysis showing any trends/inconsistencies)",
        "stressAnalysis": "string (updated stress analysis highlighting stress levels)",
        "cycleInsights": "string (updated cycle predictions / symptom check)",
        "hydrationRecs": ["array of strings (revised hydration advice)"],
        "nutritionRecs": ["array of strings (revised nutrition suggestions)"],
        "actionPlan": ["array of strings (updated action plan)"],
        "dailyRecs": ["array of strings (updated daily micro-habits)"]
      }

      ONBOARDING DATA:
      ${JSON.stringify(
        {
          lifestyle: onboarding?.lifestyle,
          healthHistory: onboarding?.healthHistory,
          goals: onboarding?.goals,
          symptoms: onboarding?.symptoms,
        },
        null,
        2,
      )}

      LAST 7 DAYS TRACKING DATA:
      ${JSON.stringify(context, null, 2)}
    `;

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await this.callWithRetry(() =>
        model.generateContent(prompt),
      );
      const responseText = result.response.text();
      const updatedProfile = JSON.parse(
        responseText || '{}',
      ) as AIHealthProfileResponse;
      return this.prisma.healthProfile.upsert({
        where: { userId },
        update: updatedProfile,
        create: {
          ...updatedProfile,
          userId,
        },
      });
    } catch (error) {
      this.logger.error('Gemini Re-analysis Error:', error);
      const existing = await this.prisma.healthProfile.findUnique({
        where: { userId },
      });
      if (existing) {
        return {
          wellnessScore: existing.wellnessScore,
          cycleHealthScore: existing.cycleHealthScore,
          sleepScore: existing.sleepScore,
          stressScore: existing.stressScore,
          stressIndicator: existing.stressIndicator,
          sleepAnalysis: existing.sleepAnalysis,
          stressAnalysis: existing.stressAnalysis,
          cycleInsights: existing.cycleInsights,
          hydrationRecs: existing.hydrationRecs,
          nutritionRecs: existing.nutritionRecs,
          actionPlan: existing.actionPlan,
          dailyRecs: existing.dailyRecs,
        };
      }
      throw error;
    }
  }

  private async callWithRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 2000,
  ): Promise<T> {
    try {
      return await fn();
    } catch (err: unknown) {
      const error = err as GeminiErrorResponse;
      const errorMessage = error.message || String(err);
      const isRateLimit =
        error.status === 429 ||
        error.statusCode === 429 ||
        errorMessage.includes('429') ||
        errorMessage.toLowerCase().includes('quota') ||
        errorMessage.toLowerCase().includes('rate limit') ||
        errorMessage.toLowerCase().includes('too many requests');

      const isServerError =
        (error.status && error.status >= 500) ||
        (error.statusCode && error.statusCode >= 500) ||
        errorMessage.includes('500') ||
        errorMessage.includes('503');

      if ((isRateLimit || isServerError) && retries > 0) {
        let retryDelayMs = delay;

        if (error.errorDetails && Array.isArray(error.errorDetails)) {
          const retryInfo = error.errorDetails.find(
            (detail) =>
              detail?.['@type'] === 'type.googleapis.com/google.rpc.RetryInfo',
          );
          if (retryInfo?.retryDelay) {
            const match = retryInfo.retryDelay.match(/^([\d.]+)(ms|s)$/);
            if (match) {
              const value = parseFloat(match[1]);
              const unit = match[2];
              retryDelayMs = Math.ceil(unit === 'ms' ? value : value * 1000);
            }
          }
        }

        // Cap delay at 30 seconds to avoid timing out the HTTP connection
        retryDelayMs = Math.min(retryDelayMs, 30000);

        // Add a random jitter of 0-1000ms
        const jitter = Math.random() * 1000;
        const totalDelay = retryDelayMs + jitter;

        this.logger.warn(
          `Gemini API returned retryable error. Retrying in ${Math.round(totalDelay)}ms... (${retries} retries left). Error: ${errorMessage}`,
        );

        await new Promise((resolve) => setTimeout(resolve, totalDelay));
        return this.callWithRetry(fn, retries - 1, delay * 2);
      }
      throw err;
    }
  }

  private async getUserContext(userId: string) {
    const last7Days = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: { gte: subDays(new Date(), 7) },
      },
      orderBy: { date: 'asc' },
    });

    const activeCycle = await this.prisma.cycle.findFirst({
      where: { userId, endDate: null },
      orderBy: { startDate: 'desc' },
    });

    return {
      dailyLogs: last7Days.map((log) => ({
        date: format(log.date, 'yyyy-MM-dd'),
        symptoms: log.symptoms,
        moods: log.moods,
        sleep: log.sleepHours,
        water: log.waterIntake,
      })),
      currentCycleDay: activeCycle
        ? Math.floor(
            (new Date().getTime() - activeCycle.startDate.getTime()) /
              (1000 * 60 * 60 * 24),
          ) + 1
        : 'Unknown',
    };
  }
}
