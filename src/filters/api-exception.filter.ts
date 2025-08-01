import { HttpStatus, Catch, Logger } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

export const formatLoggerMessage = (stack: string, message: string) => {
  const errorLines: string[] = stack?.split('\n')?.slice(1, 4);
  return `${message}\n${errorLines?.reduce(
    (prevV: string, curV: string, idx: number) =>
      prevV + `- ${curV?.trim()}${idx < errorLines.length - 1 ? '\n' : ''}`,
    '',
  )}\n`;
};

@Catch()
export class ApiExceptionsFilter implements GqlExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: { status: number; message: string; stack: string }) {
    // Format logger message
    const { status = HttpStatus.INTERNAL_SERVER_ERROR, message, stack } = exception;
    const loggerMessage = formatLoggerMessage(stack, message);

    // Display error message
    if (status >= 500) this.logger.error(loggerMessage);
    else this.logger.warn(loggerMessage);

    return exception;
  }
}
