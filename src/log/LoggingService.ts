import { Injectable, Logger } from '@nestjs/common';
import { appendFileSync, renameSync, statSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

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
    const filePath = join(cwd(), 'logs', 'common-report.log');
    const errorsFilePath = join(cwd(), 'logs', 'errors-report.log');

    const maxSize = Number(process.env.MAX_LOG_FILE_SIZE) || 1000;

    try {
      const stats = statSync(filePath);

      if (stats.size > maxSize * 1024) {
        renameSync(
          filePath,
          filePath.replace(/.log$/, `-${new Date().getTime()}-old.log`),
        );
      }
    } catch (err) {}

    const time = new Date().toLocaleString();
    appendFileSync(filePath, `${time}   ${level.toUpperCase()} - ${message}\n`);

    if (level === 'error') {
      try {
        const errorsStats = statSync(errorsFilePath);

        if (errorsStats.size > maxSize * 1024) {
          renameSync(
            errorsFilePath,
            errorsFilePath.replace(/.log$/, `-${new Date().getTime()}-old.log`),
          );
        }
      } catch (err) {}

      appendFileSync(
        errorsFilePath,
        `${time}   ${level.toUpperCase()} - ${message}\n`,
      );
    }
  }
}
