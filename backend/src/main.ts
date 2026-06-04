import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';

// Suppress Node.js DEP0169 deprecation warning from third-party libraries using url.parse
process.on('warning', (warning) => {
  if (
    warning.name === 'DeprecationWarning' &&
    (warning as { code?: string }).code === 'DEP0169'
  ) {
    return;
  }
  console.warn(warning.stack || `${warning.name}: ${warning.message}`);
});
import { ValidationPipe, INestApplication, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { Express } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser') as () => ReturnType<
  typeof import('cookie-parser')
>;

let cachedApp: INestApplication;
const logger = new Logger('Bootstrap');

async function bootstrap(): Promise<INestApplication> {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    app.enableCors({
      origin: true,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const startLocal = async () => {
    const app = await bootstrap();
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Backend running on: http://localhost:${port}`);
  };
  void startLocal();
}

// Global error handlers to prevent silent crashes on Vercel
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL: Uncaught Exception in NestJS:', err);
});

process.on('unhandledRejection', (reason) => {
  logger.error('CRITICAL: Unhandled Rejection in NestJS:', reason);
});

import { Request, Response } from 'express';

// Export for Vercel
export default async (req: Request, res: Response) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance() as Express;
  instance(req, res);
};
