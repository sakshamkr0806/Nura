import { IsDateString, IsOptional, IsArray, IsString, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDailyLogDto {
  @ApiProperty({ description: 'Date for the log in YYYY-MM-DD format' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Array of symptoms experienced', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @ApiProperty({ description: 'Mood experienced', required: false })
  @IsOptional()
  @IsString()
  mood?: string;

  @ApiProperty({ description: 'Energy level from 1 to 5', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  energyLevel?: number;

  @ApiProperty({ description: 'Hours of sleep', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(24)
  sleepHours?: number;

  @ApiProperty({ description: 'Water intake in ml', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  waterIntake?: number;

  @ApiProperty({ description: 'Type of vaginal discharge', required: false })
  @IsOptional()
  @IsString()
  dischargeType?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Sexual activity', required: false })
  @IsOptional()
  @IsBoolean()
  sexualActivity?: boolean;

  @ApiProperty({ description: 'Medication taken', required: false })
  @IsOptional()
  @IsBoolean()
  medicationTaken?: boolean;
}
