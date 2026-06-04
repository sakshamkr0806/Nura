import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { OnboardingService } from './onboarding.service';
import { SubmitOnboardingDto } from './dto/submit-onboarding.dto';
import { SaveOnboardingStepDto } from './dto/save-onboarding-step.dto';
import { GetCurrentUserId } from '../../common/decorators';

@Controller('onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async submit(
    @GetCurrentUserId() userId: string,
    @Body() dto: SubmitOnboardingDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const tokens = await this.onboardingService.submitOnboarding(userId, dto);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { access_token: tokens.access_token };
  }

  @Post('step')
  @HttpCode(HttpStatus.OK)
  async saveStep(
    @GetCurrentUserId() userId: string,
    @Body() dto: SaveOnboardingStepDto,
  ) {
    return this.onboardingService.saveStep(userId, dto);
  }

  @Post('complete')
  @HttpCode(HttpStatus.OK)
  async completeOnboarding(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const tokens = await this.onboardingService.completeOnboarding(userId);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { access_token: tokens.access_token };
  }
}
