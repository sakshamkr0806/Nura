import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BasicInfoDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsNumber()
  @IsOptional()
  height?: number; // cm

  @IsNumber()
  @IsOptional()
  weight?: number; // kg
}

export class CycleTrackingDto {
  @IsDateString()
  lastPeriodDate: string; // ISO date

  @IsNumber()
  @IsOptional()
  averageCycleLength?: number;
}

export class SymptomPreferencesDto {
  @IsBoolean()
  trackCramps: boolean;

  @IsBoolean()
  trackMood: boolean;

  @IsBoolean()
  trackEnergy: boolean;

  @IsBoolean()
  trackBloating: boolean;
}

export class HealthGoalsDto {
  @IsString()
  primaryGoal: string;
}

export class SaveOnboardingStepDto {
  @IsNumber()
  step: number; // 1-4

  @IsOptional()
  @ValidateNested()
  @Type(() => BasicInfoDto)
  basicInfo?: BasicInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CycleTrackingDto)
  cycleTracking?: CycleTrackingDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SymptomPreferencesDto)
  symptomPreferences?: SymptomPreferencesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HealthGoalsDto)
  healthGoals?: HealthGoalsDto;
}
