/**
 * Injectable, NestInterceptor, ExecutionContext y CallHandle son clases de NestJS que permiten implementar
 * interceptores de peticiones.
 */
import {  Injectable,  NestInterceptor,  ExecutionContext,  CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
/**
 * map() es un operador RxJS que permite transformar los valores emitidos por un Observable.
 * En este caso, se utiliza para transformar el valor emitido por el Observable en un objeto
 * de tipo Response.
 */
import { map } from 'rxjs/operators';
import { ResponseFormat } from '../../libs/dto/responses/format';

@Injectable()
/**
 * ResponseInterceptor es una clase que implementa el interceptor de peticiones. Se encarga de interceptar las
 * peticiones y devolver una respuesta. Esta respuesta se devuelve en un objeto de tipo Response que contiene
 * el código de estado de la respuesta, el mensaje de estado de la respuesta y los datos de la respuesta.
 */
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
    /**
     * Método que se encarga de interceptar las peticiones y devolver una respuesta.
     * @param context - Contexto de la petición, que contiene información sobre la petición, como por ejemplo, el
     *        método HTTP, la URL, los parámetros de la petición, etc.
     * @param next - Objeto que permite llamar al siguiente interceptor en la cadena de interceptores, o al
     *        controlador si no hay más interceptores.
     */
    intercept( context: ExecutionContext,  next: CallHandler ): Observable<ResponseFormat<T>> {
        /**
         * now() devuelve la fecha y hora actual en milisegundos.
         */
        const now = Date.now();
        /**
         * context.switchToHttp() devuelve un objeto que permite acceder a la petición HTTP.
         */
        const httpContext = context.switchToHttp();
        /**
         * httpContext.getRequest() devuelve la petición HTTP.
         */
        const request = httpContext.getRequest();
        /**
         * httpContext.getResponse() devuelve la respuesta HTTP.
         */
        const response = httpContext.getResponse();
        
        return next.handle().pipe(
            map((data) => ({
                data,
                path: request.path,
                duration: `${Date.now() - now}ms`,
                method: request.method,
                code: response.statusCode,
            })),
        );
    };
};