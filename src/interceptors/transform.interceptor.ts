import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
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
    return next.handle().pipe(
      map((data) => {
        if (data?.stream) {
          return data;
        } else {
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            reqId: context.switchToHttp().getRequest().reqId,
            message: data?.message || '',
            data: data,
          };
        }
      }),
    );
  }
}
