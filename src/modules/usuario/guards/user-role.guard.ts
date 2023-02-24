import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { IDatabaseAbstract } from "../../../framework/database/mysql/core/abstract";
import {ExceptionsService} from "../../../config/exceptions/exceptions.service";
import {Reflector} from "@nestjs/core";
import {META_ROLES} from "../decorators/role-protected.decorator";
import { RolesPermitidos } from '../interfaces/roles-permitidos';
import {Usuario} from "../../../framework/database/mysql/entities";

@Injectable()
export class UserRoleGuard implements CanActivate {
    private readonly exceptionService: ExceptionsService = new ExceptionsService();
    constructor(
      private readonly database: IDatabaseAbstract,
      private readonly reflector: Reflector
    ) {}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const asyncFunction = async () => {
            let roles_permitidos: string[] = this.reflector.get(META_ROLES, context.getHandler());
            
            let token =
              context.switchToHttp().getRequest().rawHeaders[1].split(' ')[1] ||
              context.switchToHttp().getRequest().rawHeaders[5].split(' ')[1];
            if (token === undefined) {
                this.exceptionService.forbiddenException({message: `${context.switchToHttp().getRequest()}`});
                this.exceptionService.forbiddenException({message: 'Se requiere un token de autenticación'});
                return false;
            }
    
            const registroDeAcceso = await this.database.registro_de_acceso.findOne({where: {token}}, 'Registro de acceso');
            if (registroDeAcceso.fecha_salida)  this.exceptionService.forbiddenException({message: 'El token de acceso ha expirado'});
            const {rol} = registroDeAcceso.usuario as Usuario;
            
            if(!roles_permitidos || roles_permitidos.length === 0) {
                roles_permitidos = [RolesPermitidos.usuario_conencional, RolesPermitidos.administrador];
            }
            
            if(roles_permitidos.includes(rol)) return true;
            
            this.exceptionService.forbiddenException({message: 'No tienes permisos para acceder a este recurso'});
            return false;
            
        };
        return asyncFunction();
        
        
    }
}
