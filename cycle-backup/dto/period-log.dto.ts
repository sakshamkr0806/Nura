import { IsDateString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePeriodLogDto {
  @ApiProperty({ description: 'Start date of the period' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date of the period', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Length of period in days (1-15)', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  periodLength?: number;

  @ApiProperty({ description: 'Length of cycle in days (15-60)', required: false })
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(60)
  cycleLength?: number;
}

export class UpdatePeriodLogDto {
  @ApiProperty({ description: 'Start date of the period', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'End date of the period', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
