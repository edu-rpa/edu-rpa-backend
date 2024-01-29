import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { EmailAlreadyExistsException } from '../exceptions';

type Exception = EmailAlreadyExistsException;

@Catch(EmailAlreadyExistsException)
export class HttpExceptionRedirectFilter implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message;

    response
      .redirect(`${process.env.FRONTEND_URL}/auth/login?error=${message}`);
  }
}