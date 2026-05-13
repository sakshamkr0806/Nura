import { Controller, Get } from '@nestjs/common';
import { GetCurrentUserId } from '../../common/decorators';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('summary')
  async getSummary(@GetCurrentUserId() userId: string) {
    const score = await this.analyticsService.getWellnessScore(userId);
    const insights = await this.analyticsService.getInsights(userId);
    const recommendations = await this.analyticsService.getRecommendations(userId);

    return {
      score,
      insights,
      recommendations,
    };
  }
}
