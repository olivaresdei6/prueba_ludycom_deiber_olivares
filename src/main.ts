import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfiguration } from './config/env.config';
import 'colors';
import { LoggerService } from './config/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './config/interceptors/logger';
import { ResponseInterceptor } from './config/interceptors/response';
import { TimeoutInterceptor } from './config/interceptors/timeout';
import { AllExceptionFilter } from './config/filters/index';
import { ValidationPipe } from '@nestjs/common/pipes';
import { SwaggerConfig } from './config/swagger/swagger';
import { Logger } from '@nestjs/common';

async function main() {
	const logger = new LoggerService();
	const configService = new ConfigService();

	const app = await NestFactory.create(AppModule);

	app.useGlobalInterceptors(
        new LoggingInterceptor(logger),
        new ResponseInterceptor(),
        new TimeoutInterceptor(),
    );


	app.useGlobalFilters(new AllExceptionFilter(logger));

	app.enableCors();

	
	/**
     * Configuración de la validación de datos de entrada.
     */
    app.useGlobalPipes(
        new ValidationPipe({
                /**
                 * whitelist es una propiedad que indica si se deben ignorar los
                 * datos
                 */
                whitelist: true,
                /**
                 * forbidNonWhitelisted es una propiedad que indica si se debe
                 * lanzar una excepción cuando se reciban datos de entrada que no
                 * estén definidos en la clase DTO.
                 */
                forbidNonWhitelisted: true,
                /**
                 * transform es una propiedad que indica si se deben transformar
                 * los datos de entrada a los tipos definidos en la clase DTO.
                 */
                transform: true,
                /**
                 * transformOptions es una propiedad que permite configurar la
                 * transformación de datos de entrada.
                 */
                transformOptions: {
                    /**
                     * enableImplicitConversion es una propiedad que indica si se
                     * deben transformar los datos de entrada a los tipos definidos
                     * en la clase DTO.
                     */
                    enableImplicitConversion: true
                }
            }
        )
    );

	/**
     * Configuración del prefijo global para todas las rutas.
     */
    app.setGlobalPrefix("api/v1/ludycom/");
	
    /**
     * Exponiendo el documento de Swagger en la ruta /api.
     */
    SwaggerConfig.ConfigSwaggerModule(app);
    
    await app.listen(EnvConfiguration().portServer);
}
main().then(() => {
	const logger = new Logger('NestApplication');
	logger.log(`Servidor corriendo en el puerto ${EnvConfiguration().portServer}`);
});
