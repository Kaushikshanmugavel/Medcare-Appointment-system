import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetail = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        errorDetail = (exceptionResponse as any).error || exception.name;
      } else {
        message = exception.message;
        errorDetail = exception.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorDetail = exception.name;
    }

    // Format validation pipe error arrays nicely if message is array
    if (Array.isArray(message)) {
      message = message.join(', ');
    }

    response.status(status).json({
      success: false,
      message,
      error: errorDetail,
    });
  }
}
