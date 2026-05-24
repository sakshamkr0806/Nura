import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { GetCurrentUserId } from '../../common/decorators';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Get('insights')
  getInsights(@GetCurrentUserId() userId: string) {
    return this.aiService.generateInsights(userId);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUserId() userId: string) {
    return this.aiService.getHealthProfile(userId);
  }

  @Post('re-analyze')
  @HttpCode(HttpStatus.OK)
  reAnalyze(@GetCurrentUserId() userId: string) {
    return this.aiService.reAnalyzeProfile(userId);
  }
}
