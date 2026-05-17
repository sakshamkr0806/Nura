import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';

@Injectable()
export class AIService {
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
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText || '{}') as Record<string, unknown>;
    } catch (error) {
      console.error('Gemini Error:', error);
      return {
        summary:
          'We are unable to generate personalized insights right now, but keep up your consistent logging!',
        recommendations: ['Maintain a regular sleep schedule', 'Stay hydrated'],
        educationalNote:
          'Consistency in logging helps identify patterns over time.',
      };
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
