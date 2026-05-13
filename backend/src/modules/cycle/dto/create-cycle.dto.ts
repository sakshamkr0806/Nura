import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCycleDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
