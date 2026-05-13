import { Controller, Get } from '@nestjs/common';
import { GetCurrentUserId } from '../../common/decorators';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Get('insights')
  getInsights(@GetCurrentUserId() userId: string) {
    return this.aiService.generateInsights(userId);
  }
}
