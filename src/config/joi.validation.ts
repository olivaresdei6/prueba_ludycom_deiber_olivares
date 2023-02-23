import * as Joi from "joi";

/**
 * Un validation Schema es un objeto que define la estructura de un objeto que
 * se va a validar. En este caso, se define la estructura de un objeto que se
 * va a utilizar para configurar la aplicación. El objeto de configuración de la
 * aplicación se define en el archivo .env. Para ello se utiliza la librería Joi.
 * Esta librería con más de 11 millones de descargas en npm, es una de las
 * librerías más populares para la validación de datos en NodeJS y además se
 * caracteriza por ser muy sencilla de usar.
 */

export const JoiValidationSchema = Joi.object({
    MYSQL_ROOT_PASSWORD: Joi.string().required(),
    MYSQL_DATABASE: Joi.string().required(),
    MYSQL_USER: Joi.string().required(),
    MYSQL_PASSWORD: Joi.string().required(),
    PORT_MYSQL: Joi.number().default(5432),
    PORT_SERVER: Joi.number().default(3000),
    MYSQL_HOST: Joi.string().required(),
})