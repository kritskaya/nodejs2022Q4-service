import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { parse } from 'yaml';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './common/exception-filters/HttpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  const file = await readFile(join(cwd(), 'doc', 'api.yaml'), 'utf8');
  const document = parse(file);

  SwaggerModule.setup('doc', app, document);

  dotenv.config();
  const PORT = Number(process.env.PORT) || 4000;
  await app.listen(PORT);
}
bootstrap();
