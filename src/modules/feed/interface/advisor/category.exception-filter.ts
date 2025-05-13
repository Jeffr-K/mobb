import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {
  FeedCategoryNotFoundException,
  FeedCategoryRegistrationFailedException,
  FeedCategoryHasAssociatedFeedsException,
} from '@modules/feed/core/exception/exception';

type FeedCategoryException =
  | FeedCategoryNotFoundException
  | FeedCategoryRegistrationFailedException
  | FeedCategoryHasAssociatedFeedsException;

@Catch(FeedCategoryNotFoundException, FeedCategoryRegistrationFailedException, FeedCategoryHasAssociatedFeedsException)
export class FeedCategoryExceptionFilter implements ExceptionFilter {
  catch(exception: FeedCategoryException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const { status, message } = this.getErrorResponse(exception);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorResponse(exception: FeedCategoryException): { status: number; message: string } {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '서버 오류가 발생했습니다.';

    switch (true) {
      case exception instanceof FeedCategoryNotFoundException:
        status = HttpStatus.NOT_FOUND;
        message = exception.message || '카테고리를 찾을 수 없습니다.';
        break;

      case exception instanceof FeedCategoryRegistrationFailedException:
        status = HttpStatus.BAD_REQUEST;
        message = exception.message || '카테고리 생성에 실패했습니다.';
        break;

      case exception instanceof FeedCategoryHasAssociatedFeedsException:
        status = HttpStatus.BAD_REQUEST;
        message =
          exception.message || '카테고리에 연결된 피드가 있어 삭제할 수 없습니다. forceUpdate 옵션을 사용하세요.';
        break;
    }

    return { status, message };
  }
}
