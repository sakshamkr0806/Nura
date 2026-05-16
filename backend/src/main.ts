import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { Express } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser') as () => ReturnType<
  typeof import('cookie-parser')
>;

let cachedApp: INestApplication;

async function bootstrap(): Promise<INestApplication> {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    app.enableCors({
      origin: [
        frontendUrl,
        'https://cyclewell.vercel.app',
        'https://nura-gamma.vercel.app',
      ],
      credentials: true,
    });

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  const startLocal = async () => {
    const app = await bootstrap();
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Backend running on: http://localhost:${port}`);
  };
  void startLocal();
}

import { Request, Response } from 'express';

// Export for Vercel
export default async (req: Request, res: Response) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance() as Express;
  instance(req, res);
};
