import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from './LoggingService';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new LoggingService('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, protocol, hostname, originalUrl, query, body } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `Request: ${method} ${protocol}://${hostname}${originalUrl} query: ${JSON.stringify(
          query,
        )} body: ${JSON.stringify(body)}; Response: ${statusCode}`,
      );
    });

    next();
  }
}
