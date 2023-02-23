import { CallHandler, ExecutionContext, Injectable,  NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable()
/**
 * TimeoutInterceptor es una clase que implementa el interceptor de peticiones. Se encarga de interceptar las
 * peticiones y devolver una respuesta si la petición tarda más de 10 segundos en responder.
 */
export class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(timeout(100000));
    };
};