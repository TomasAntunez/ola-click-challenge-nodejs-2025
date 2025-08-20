import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import type { Observable } from 'rxjs';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    this.logger.log(`Url: ${req.originalUrl} - Method: ${req.method}`, HttpLoggingInterceptor.name);
    return next.handle();
  }
}
