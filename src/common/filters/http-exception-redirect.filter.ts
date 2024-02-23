import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { EmailAlreadyExistsException, UnableToCreateConnectionException } from '../exceptions';

@Catch(EmailAlreadyExistsException)
export class HttpExceptionRedirectLoginFilter implements ExceptionFilter {
  catch(exception: EmailAlreadyExistsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { redirectUrl } = JSON.parse(request.query.state as string);
    const message = exception.message;

    response
      .redirect(`${redirectUrl}?error=${message}`);
  }
}

@Catch(UnableToCreateConnectionException)
export class HttpExceptionRedirectISFilter implements ExceptionFilter {
  catch(exception: UnableToCreateConnectionException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message;

    response
      .redirect(`${process.env.FRONTEND_URL}/integration-service?error=${message}`);
  }
}