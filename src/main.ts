import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import { dotenvFiles } from './config/config.env';
import fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile as string)) {
    dotenvExpand(
      dotenv.config({
        path: dotenvFile as string,
      }),
    );
  }
});

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
