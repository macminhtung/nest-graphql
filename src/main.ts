import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { Logger } from '@nestjs/common';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableCors({ origin: process.env.APP_URI, credentials: true });
  await app.register(fastifyCookie);

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
