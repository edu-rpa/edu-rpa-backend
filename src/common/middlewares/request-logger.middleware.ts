import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export const customLog = (context: string, message: any) => {
  const now = new Date();
  const date = now.toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const time = now.toLocaleTimeString('vi-VN', { hour12: false });
  console.log(`${time} ${date} \x1b[33m[${context}]\x1b[0m ${message}`);
}

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    customLog('RequestLogger', `${method} ${originalUrl}`);
    next();
  }
}