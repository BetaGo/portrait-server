import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as dotenvExpand from 'dotenv-expand';

import { dotenvFiles } from './config/config.env';
import * as fs from 'fs';

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
