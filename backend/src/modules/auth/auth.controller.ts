import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto, UpdateDobDto } from './dto/auth.dto';
import { RtGuard } from './guards';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '../../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const tokens = await this.authService.signup(dto);
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const tokens = await this.authService.signin(dto);
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Patch('dob')
  @HttpCode(HttpStatus.OK)
  async updateDob(
    @GetCurrentUserId() userId: string,
    @Body() dto: UpdateDobDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const tokens = await this.authService.updateDob(userId, dto);
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
