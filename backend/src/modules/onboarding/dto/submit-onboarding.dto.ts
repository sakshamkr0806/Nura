import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MenstrualHealthDto {
  @IsNumber()
  averageCycleLength: number;

  @IsDateString()
  lastPeriodDate: string;

  @IsArray()
  @IsString({ each: true })
  pmsSymptoms: string[];

  @IsBoolean()
  irregularCycles: boolean;

  @IsString()
  painSeverity: string;
}

export class LifestyleDto {
  @IsNumber()
  sleepHours: number;

  @IsNumber()
  waterIntake: number;

  @IsString()
  activityLevel: string;

  @IsString()
  stressLevel: string;

  @IsNumber()
  screenTime: number;
}

export class HealthHistoryDto {
  @IsBoolean()
  hasPcos: boolean;

  @IsBoolean()
  hasThyroid: boolean;

  @IsBoolean()
  hasHormonalImbalance: boolean;

  @IsArray()
  @IsString({ each: true })
  medications: string[];
}

export class WellnessGoalsDto {
  @IsArray()
  @IsString({ each: true })
  goals: string[];
}

export class MoodEnergyDto {
  @IsArray()
  @IsString({ each: true })
  moods: string[];

  @IsString()
  @IsOptional()
  energyLevel?: string;

  @IsString()
  @IsOptional()
  anxietyFrequency?: string;
}

export class SubmitOnboardingDto {
  @ValidateNested()
  @Type(() => MenstrualHealthDto)
  menstrualHealth: MenstrualHealthDto;

  @ValidateNested()
  @Type(() => LifestyleDto)
  lifestyle: LifestyleDto;

  @ValidateNested()
  @Type(() => HealthHistoryDto)
  healthHistory: HealthHistoryDto;

  @ValidateNested()
  @Type(() => WellnessGoalsDto)
  wellnessGoals: WellnessGoalsDto;

  @ValidateNested()
  @Type(() => MoodEnergyDto)
  moodEnergy: MoodEnergyDto;
}
