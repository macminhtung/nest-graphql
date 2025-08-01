import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.disable('x-powered-by'); // Remove x-powered-by header
  app.enableCors({ origin: process.env.APP_URI, credentials: true });
  app.use(cookieParser());

  // #===========================#
  // # ==> START APPLICATION <== #
  // #===========================#
  const { PROTOCOL, DOMAIN, PORT } = process.env;
  await app.listen(parseInt(`${PORT}`));
  const logger = app.get(Logger);
  logger.debug(
    `==> APP IS RUNNING | PORT: ${PORT} <== [${PROTOCOL}://${DOMAIN}:${PORT}/graphql]`,
    'APPLICATION',
  );
}
bootstrap();
