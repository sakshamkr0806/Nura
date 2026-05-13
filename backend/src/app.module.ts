import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CycleModule } from './modules/cycle/cycle.module';
import { LogModule } from './modules/log/log.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AIModule } from './modules/ai/ai.module';
import { AlertModule } from './modules/alert/alert.module';
import { ReportModule } from './modules/report/report.module';
import { ArticleModule } from './modules/article/article.module';
import { AtGuard } from './modules/auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CycleModule,
    LogModule,
    AnalyticsModule,
    AIModule,
    AlertModule,
    ReportModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
