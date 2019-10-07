import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as dotenv from 'dotenv';
import * as session from 'express-session';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    session({
      secret: 'just use to store auth redirect path',
      resave: false,
      saveUninitialized: true,
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
