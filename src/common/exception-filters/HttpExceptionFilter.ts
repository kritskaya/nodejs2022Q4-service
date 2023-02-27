import { ArgumentsHost, ExceptionFilter, LoggerService } from '@nestjs/common';
import { Catch } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Intenal server error';

    if (!(exception instanceof HttpException)) {
      this.logger.error(`Intenal server error stack: ${exception.stack}`);
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      path: request.url,
      timestamp: new Date().toLocaleString(),
    });
  }
}
