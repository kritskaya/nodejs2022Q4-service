import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd, exit } from 'process';
import { parse } from 'yaml';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './common/exception-filters/HttpExceptionFilter';
import { LoggingService } from './log/LoggingService';

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

  const logger = app.get(LoggingService);

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception thrown: ${err}`);
    exit(1);
  });
  
  process.on('unhandledRejection', (reason, p) => {
    logger.error(`Unhandled Rejection at Promise ${p} with reason: ${reason}`);
  });
}
bootstrap();
