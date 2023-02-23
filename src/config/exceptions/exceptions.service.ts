/**
 * Métodos para controlar las excepciones que puede generar la base de datos.
 */
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException,  NotFoundException, UnauthorizedException } from '@nestjs/common';
/**
 * Esta clase define las propiedades y métodos que debe tener un servicio de excepciones.
 */
import { IFormatExceptionMessage } from './interfaces/exception.interface';
/**
 * IException es una interfaz que permite definir el formato de los mensajes de error.
 */
import { IException } from './interfaces/message.interface';

@Injectable()
export class ExceptionsService implements IException {
    unauthorizedException(data?: IFormatExceptionMessage): void {
        throw new UnauthorizedException(data);
    }
    notFoundException(data?: IFormatExceptionMessage): void {
        throw new NotFoundException(data);
    };
    badRequestException(data: IFormatExceptionMessage): void {
        throw new BadRequestException(data);
    };
    internalServerErrorException(data?: IFormatExceptionMessage): void {
        throw new InternalServerErrorException(data);
    };
    forbiddenException(data?: IFormatExceptionMessage): void {
        throw new ForbiddenException(data);
    };
}