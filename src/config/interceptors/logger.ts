import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
/**
 * Observable es un tipo de dato que se utiliza en RxJS para representar un flujo de datos asincrónico.
 * Se suele usar cuando se trabaja con operaciones asíncronas, es decir, cuando se trabaja con datos
 * que no están disponibles de forma inmediata.
 */
import { Observable } from 'rxjs';
/**
 * El operador tap() permite ejecutar una función para cada valor emitido por el Observable, sin modificar
 * el valor emitido. Se suele usar para efectos secundarios, como por ejemplo, para imprimir por consola
 * los valores emitidos por el Observable.
 */
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
/**
 * Clase que implementa el interceptor de peticiones. Se encarga de interceptar las peticiones y
 * devolver una respuesta.
 */
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}
    
    /**
     * Método que se encarga de interceptar las peticiones y devolver una respuesta.
     * @param context - Contexto de la petición, que contiene información sobre la petición, como por ejemplo, el
     *        método HTTP, la URL, los parámetros de la petición, etc.
     * @param next - Objeto que permite llamar al siguiente interceptor en la cadena de interceptores, o al
     *        controlador si no hay más interceptores.
     * @returns - Observable que emite la respuesta de la petición.
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
         * this.getIP(request) devuelve la IP del cliente que ha realizado la petición.
         */
        const ip = this.getIP(request);
        /**
         * this.logger.log() imprime por consola la IP del cliente que ha realizado la petición, el método HTTP
         * y la URL de la petición.
         */
        this.logger.log(
            `Incoming Request on ${request.path}`,
            `method=${request.method} ip=${ip}`,
        );
    
        /**
         * next.handle() llama al siguiente interceptor en la cadena de interceptores, o al controlador si no hay
         * más interceptores. pipe() permite encadenar operadores RxJS, que se ejecutarán en el orden en el que
         * se hayan encadenado. tap() permite ejecutar una función para cada valor emitido por el Observable, sin
         * modificar el valor emitido. Se suele usar para efectos secundarios, como por ejemplo, para imprimir por
         * consola los valores emitidos por el Observable. En este caso next.handle() devuelve un Observable que
         * puede ser por ejemplo, un Observable que emite un objeto de tipo User, luego pipe() permite encadenar
         * el operador tap() que permite ejecutar una función para cada valor emitido por el Observable.
         * Sin pipe() y tap() no se podría imprimir por consola el valor emitido por el Observable. Cabe resaltar
         * que pipe se comporta como una promesa, es decir, que se ejecuta de forma asíncrona una vez que se
         * resuelva la promesa anterior, en este caso, la promesa que devuelve next.handle() que es un Observable
         * del tipo solicitado por el controlador.
         */
        return next.handle().pipe(
            tap(() => {
                this.logger.log(
                    `End Request for ${request.path}`,
                    `method=${request.method} ip=${ip} duration=${Date.now() - now}ms`,
                );
            }),
        );
    };
    private getIP(request: any): string {
        let ip: string;
        const ipAddr = request.headers['x-forwarded-for'];
        if (ipAddr) {
            const list = ipAddr.split(',');
            ip = list[list.length - 1];
        } else {
            ip = request.connection.remoteAddress;
        }
        
        return ip.replace('::ffff:', '');
    };
}