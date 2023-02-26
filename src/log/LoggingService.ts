import { Injectable, Logger } from '@nestjs/common';
import { appendFile } from 'fs/promises';
import { join } from 'path';

type LogMethods = 'error' | 'warn' | 'log' | 'debug' | 'verbose';

@Injectable()
export class LoggingService extends Logger {
  private logLevel: number;

  constructor(name: string) {
    super(name);
    this.logLevel = Number(process.env.LOG_LEVEL) || 0;
  }

  error(message: any, ...optionalParams: any[]) {
    this.logMessage('error', 0, message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logMessage('warn', 1, message, ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]) {
    this.logMessage('log', 2, message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logMessage('debug', 3, message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logMessage('verbose', 4, message, ...optionalParams);
  }

  logMessage(
    logMethod: LogMethods,
    level: number,
    message: string,
    ...optionalParams: any[]
  ) {
    if (level > this.logLevel) return;

    super[logMethod](message, ...optionalParams);
    this.writeToFile(logMethod, message);
  }

  writeToFile(level: LogMethods, message: string) {
    const filePath = join(process.env.PWD, 'library-service.log');

    const time = new Date().toLocaleString();
    appendFile(filePath, `${time}   ${level.toUpperCase()} - ${message}\n`);
  }
}
