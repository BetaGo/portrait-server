import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as dotenv from 'dotenv';
import { join } from 'path';
import { NotFoundExceptionFilter } from './not-found-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalFilters(new NotFoundExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
