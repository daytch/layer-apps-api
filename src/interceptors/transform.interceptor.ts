import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    if (context.getHandler().toString().indexOf('seeUploadedFile') > -1) {
      return next.handle().pipe();
    } else {
      return next.handle().pipe(
        map((data) => {
          if (data?.stream) {
            return data;
          } else {
            const message = data?.message || '';
            delete data.message;
            return {
              statusCode: context.switchToHttp().getResponse().statusCode,
              reqId: context.switchToHttp().getRequest().reqId,
              message,
              data: data,
            };
          }
        }),
      );
    }
  }
}
