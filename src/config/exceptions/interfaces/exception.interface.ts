/**
 * Esta es una interfaz que define las propiedades que debe tener un objeto de tipo Exception.
 * Esta interfaz se utiliza para definir el tipo de la variable que se va a utilizar para almacenar
 * el objeto de tipo Exception.
 */
export interface IFormatExceptionMessage {
    message: string;
    code?: number;
}