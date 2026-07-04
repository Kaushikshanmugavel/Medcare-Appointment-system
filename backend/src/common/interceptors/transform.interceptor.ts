import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already in structured format (e.g. from some custom responses), bypass
        if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
          return data;
        }

        let message = 'Operation completed successfully';
        let responseData = data;

        // Custom messages can be passed by returning an object with a __message key
        if (data && typeof data === 'object' && '__message' in data) {
          message = data.__message;
          delete data.__message;
          responseData = data.data !== undefined ? data.data : data;
        }

        return {
          success: true,
          message,
          data: responseData === undefined ? null : responseData,
        };
      }),
    );
  }
}
