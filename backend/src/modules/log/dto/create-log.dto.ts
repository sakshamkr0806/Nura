import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateLogDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  symptoms?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  moods?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  sleepHours?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  waterIntake?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
