import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ApiLoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = GqlExecutionContext.create(context).getContext().req;
    const { ip, method, body } = request;
    this.logger.log(`==> REQUEST: ${ip} ${method} ${body.operationName}`);

    return next.handle();
  }
}
