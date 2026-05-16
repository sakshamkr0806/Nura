import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, SigninDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private notifications: NotificationsService,
  ) {}

  async signup(dto: SignupDto): Promise<Tokens> {
    const email = dto.email.toLowerCase();
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('An account with this email already exists');
    }

    // Guard: duplicate phone number (only if provided)
    if (dto.phoneNumber) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phoneNumber: dto.phoneNumber },
      });
      if (existingPhone) {
        throw new ConflictException(
          'An account with this phone number already exists',
        );
      }
    }

    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: hash,
        name: dto.name,
        phoneNumber: dto.phoneNumber ?? null,
        emailNotifications: dto.emailNotifications ?? false,
      },
    });

    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.role,
      newUser.name ?? '',
      newUser.phoneNumber ?? undefined,
    );
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    // Fire-and-forget welcome email — does not block signup response
    void this.notifications.sendWelcomeNotification(
      newUser.email,
      newUser.name ?? 'there',
    );

    return tokens;
  }

  async signin(dto: SigninDto): Promise<Tokens> {
    // Support login by email OR E.164 phone number
    const identifier = dto.identifier.toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phoneNumber: dto.identifier }],
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.name ?? '',
      user.phoneNumber ?? undefined,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.name ?? '',
      user.phoneNumber ?? undefined,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(
    userId: string,
    email: string,
    role: string,
    name: string,
    phoneNumber?: string,
  ): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
      role,
      name,
      ...(phoneNumber ? { phoneNumber } : {}),
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
