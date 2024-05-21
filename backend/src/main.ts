import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { engine } from 'express-handlebars';


import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.engine('hbs', engine({
    extname: '.hbs',
    layoutsDir: join(__dirname, '..', 'views', 'layouts'),
    partialsDir: join(__dirname, '..', 'views', 'partials'),
    defaultLayout: false, // Disable layouts
}));

  app.set('view engine', 'hbs');
  app.set('views', join(__dirname, '..', 'views'));

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'))

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
