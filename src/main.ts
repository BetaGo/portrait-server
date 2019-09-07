import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { join } from 'path';
import { NotFoundExceptionFilter } from './not-found-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.use(session({
    secret: 'just use to store auth redirect path',
    resave: false,
    saveUninitialized: true,
  }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
