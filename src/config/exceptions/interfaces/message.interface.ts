/**
 * IFormatExceptionMessage es una interfaz que permite definir el formato de los mensajes de error.
 * Para implementar esta interfaz, se debe definir un objeto que tenga las propiedades: code y message.
 */
import { IFormatExceptionMessage } from "./exception.interface";

/**
 * Esta interfaz define el formato de los mensajes de error que se van a utilizar en la aplicación.
 */
export interface IException {
    /**
     * badRequest es un método que permite definir el formato de los mensajes de error de tipo BadRequest.
     * badRequest se utiliza cuando el cliente envía una solicitud que no es válida.
     * @param data - Es un objeto que contiene la información del error.
     * @returns void
     */
    badRequestException(data: IFormatExceptionMessage): void;
    
    /**
     * InternalServerError es un método que permite definir el formato de los mensajes de error de tipo InternalServerError.
     * InternalServerError se utiliza cuando ocurre un error interno en el servidor.
     * @param data - un objeto de tipo IFormatExceptionMessage - { code: string, message: string }
     * @returns void
     */
    internalServerErrorException(data?: IFormatExceptionMessage): void;
    
    /**
     * Forbidden es un método que permite definir el formato de los mensajes de error de tipo Forbidden.
     * Forbidden se utiliza cuando el cliente no tiene permisos para acceder a un recurso.
     * @param data - Objeto que contiene el código y el mensaje de error.
     * @returns void
     */
    forbiddenException(data?: IFormatExceptionMessage): void;
    
    /**
     * Unauthorized es un método que permite definir el formato de los mensajes de error de tipo Unauthorized.
     * Unauthorized se utiliza cuando el cliente no está autenticado.
     * @param data - IFormatExceptionMessage - Es un objeto que contiene el código y el mensaje de error.
     * @returns void
     */
    unauthorizedException(data?: IFormatExceptionMessage): void;
    
    /**
     * NotFoundException es un método que permite definir el formato de los mensajes de error de tipo NotFoundException.
     * NotFoundException se utiliza cuando el cliente solicita un recurso que no existe.
     * @param data - Es un objeto que contiene el código y el mensaje de error.
     * @returns void
     */
    notFoundException(data?: IFormatExceptionMessage): void;
}