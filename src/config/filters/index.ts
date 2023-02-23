/**
 * ArgumentsHost, Catch, ExceptionFilter, HttpException y HttpStatus son clases que nos permiten
 * definir el tipo de datos que se espera recibir en el cuerpo de la petición y que son propias del
 * paquete @nestjs/common.
 *
 * Adicionalmente, también se importa la clase HttpExceptionFilter que es una clase que permite definir
 * el formato de los mensajes de error.
 *
 * ArgumentHost es una clase que nos permite definir el tipo de datos que se espera recibir en el cuerpo de la petición.
 *
 * Catch es un decorador que nos permite definir la clase HttpExceptionFilter como un filtro de excepciones. Esta
 * clase se va a inyectar en el controlador y puede ser utilizado fuera del controlador y se puede
 * utilizar en otros servicios.
 *
 * HttpException es una clase que representa una excepción HTTP y se utiliza para definir la estructura de la
 * tabla en la base de datos.
 *
 * HttpStatus es una clase que representa los códigos de estado HTTP y se utiliza para definir la estructura de la
 * tabla en la base de datos.
 *
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
/**
 * LoggerService es una clase que permite mostrar mensajes en la consola. Esta clase se va a inyectar en el
 * controlador y puede ser utilizado fuera del controlador y se puede utilizar en otros servicios.
 */
import { LoggerService } from '../logger/logger.service';
/**
 * IError es una interfaz que permite definir el tipo de datos que se espera recibir en el cuerpo de la petición.
 */
import { IError } from './interfaces/error.interface';

/**
 * @Catch es un decorador que nos permite definir la clase AllExceptionsFilter como un filtro de excepciones. Esta
 * clase se va a inyectar en el controlador y puede ser utilizado fuera del controlador y se puede
 * utilizar en otros servicios.
 */
@Catch()

/**
 * AllExceptionsFilter es una clase que permite definir el formato de los mensajes de error.
 */
export class AllExceptionFilter implements ExceptionFilter {
    /**
     * LoggerService es una clase que permite mostrar mensajes en la consola. Esta clase se va a inyectar en el
     * controlador y puede ser utilizado fuera del controlador y se puede utilizar en otros servicios.
     * @param logger
     */
    constructor(private readonly logger: LoggerService) {}
    
    /**
     * catch es un método que permite definir el formato de los mensajes de error.
     * @param exception - Es una excepción que se va a capturar.
     * @param host - Es un objeto que contiene la información de la petición.
     */
    catch(exception: any, host: ArgumentsHost) {
        /**
         * ctx es un objeto que contiene la información de la petición. Significa
         * contexto. Este contexto es el que se va a utilizar para obtener la
         * información de la petición, ejemplo: el método, la url, el cuerpo de la
         * petición, etc. host.switchToHttp() es un método que permite
         * obtener el contexto de la petición.
         */
        const ctx = host.switchToHttp();
        /**
         * response es un objeto que contiene la información de la respuesta. Por ejemplo,
         * el código de estado de la respuesta, el mensaje de la respuesta, etc.
         */
        const response = ctx.getResponse();
        /**
         * request es un objeto que contiene la información de la petición. Por ejemplo,
         * el método, la url, el cuerpo de la petición, etc. Se diferencia de ctx porque
         * ctx contiene la información de la petición y la respuesta, mientras que request
         * solo contiene la información de la petición.
         */
        const request: any = ctx.getRequest();
        /**
         * status es un número que representa el código de estado de la respuesta. Por ejemplo,
         * 200, 201, 400, 401, 404, 500, etc. Si la excepción es una instancia de HttpException,
         * entonces se obtiene el código de estado de la respuesta de la excepción, de lo
         * contrario, se obtiene el código de estado de la respuesta de la clase HttpStatus que
         * será 500, ya que es el código de estado de la respuesta para un error interno del
         * servidor.
         */
        const status = exception instanceof HttpException? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        /**
         * message es un string que representa el mensaje de la respuesta. Si la excepción es una
         * instancia de HttpException, entonces se obtiene el mensaje de la respuesta de la
         * excepción, de lo contrario, se obtiene el mensaje de la respuesta de la clase
         * HttpStatus que será 'Internal server error', ya que es el mensaje de la respuesta
         * para un error interno del servidor.
         *
         * As IError y Error es un cast que permite definir el tipo de datos que se espera recibir
         * en el cuerpo de la petición. Se utiliza instanceof para verificar si la excepción es una instancia de
         * HttpException, porque esta clase representa una excepción HTTP y se utiliza para definir la estructura de la tabla en
         * la base de datos.
         *
         * Message es un string que representa el mensaje de la respuesta. Si la excepción es una instancia de
         * HttpException, entonces se obtiene el mensaje de la respuesta de la excepción, de lo contrario, se
         * obtiene el mensaje de la respuesta de la clase HttpStatus que será 'Internal server error', ya que es
         * el mensaje de la respuesta para un error interno del servidor.
         *
         * code: null es un string que representa el código de error. Si la excepción es una instancia de
         * HttpException, entonces se obtiene el código de error de la respuesta de la excepción, de lo
         * contrario, se obtiene el código de error de la respuesta de la clase HttpStatus que será null, ya
         * que es el código de error de la respuesta para un error interno del servidor.
         */
        const message = exception instanceof HttpException ? (exception.getResponse() as IError) : { message: (exception as Error).message, code: null };
        /**
         * responseDto es un objeto que contiene la información de la respuesta. Por ejemplo,
         * el código de estado de la respuesta, la fecha de la respuesta, el mensaje de la
         * respuesta, etc. Se hace uso del spread operator para obtener la información de la
         * petición y la respuesta.
         */
        const responseData = {
            ...{
                code: status,
                timestamp: new Date().toISOString(),
                path: request.url
            },
            ...message
        };
        /**
         * Se muestra el mensaje de error en la consola.
         */
        this.logMessage(request, message, status, exception);
        /**
         * Se envía la respuesta al cliente.
         */
        response.status(status).json(responseData);
    };
    
    /**
     * logMessage es un método que permite mostrar el mensaje de error en la consola.
     * @param request
     * @param message
     * @param status
     * @param exception
     * @private
     */
    private logMessage( request: any, message: IError, status: number, exception: any,
    ) {
        /**
         * Si el código de estado de la respuesta es 500, entonces se muestra el mensaje de error en la consola.
         */
        if (status >= 500) {
            /**
             * Si el el status es mayor o igual a 500 significa que es un error interno del servidor, por lo tanto,
             * se muestra el mensaje de error en la consola. Caso contrario, la propiedad exception.stack no existe,
             * esta propiedad solo existe en los errores internos del servidor y se utiliza para mostrar la pila de
             * llamadas de la excepción. Si no se cumple la condición se retorna un string vacío.
             */
            this.logger.error(
                `End Request for ${request.path}`,
                `method=${request.method} status=${status} code=${
                    message.code ? message.code : null
                } message=${message.message ? message.message : null}`,
                status >= 500 ? exception.stack : '',
            );
        } else {
            this.logger.warn(
                `End Request for ${request.path}`,
                `method=${request.method} status=${status} code=${
                    message.code ? message.code : null
                } message=${message.message ? message.message : null}`,
            );
        }
    }
}