import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from './interfaces/logger.interface';

@Injectable()
/**
 * Esta clase define las propiedades y métodos que debe tener un servicio de log.
 * Este servicio se utiliza para registrar los mensajes de log en el archivo de log.
 * Para utilizar este servicio, se debe importar en el archivo donde se va a utilizar, en este caso
 * se importa en el archivo src\config\logger\logger.module.ts.
 * Este servicio extiende la clase Logger de NestJS la cual permite registrar los mensajes de log en el archivo de log.
 * Además, este servicio implementa la interfaz ILogger la cual define las propiedades y métodos que debe tener un servicio de log.
 */
export class LoggerService extends Logger implements ILogger {
    debug(context: string, message: string) {
        if (process.env.NODE_ENV !== 'production') {
            super.debug(`[DEBUG] ${message}`, context);
        }
    }
    log(context: string, message: string) {
        super.log(`[INFO] ${message}`, context);
    }
    error(context: string, message: string, trace?: string) {
        super.error(`[ERROR] ${message}`, trace, context);
    }
    warn(context: string, message: string) {
        super.warn(`[WARN] ${message}`, context);
    }
    
    verbose(context: string, message: string) {
        if (process.env.NODE_ENV !== 'production') {
            super.verbose(`[VERBOSE] ${message}`, context);
        }
    }
}