import { SetMetadata } from '@nestjs/common';
import {RolesPermitidos} from "../interfaces/roles-permitidos";

export const META_ROLES = 'roles';


/**
 * Función decoradora que permite definir los roles permitidos para acceder a un recurso.
 * Esta recibe como parámetro un array de roles permitidos para acceder a un recurso.
 * @param args
 * @constructor
 */
export const RoleProtected = (...args: RolesPermitidos[]) => {
    // Si no se envía ningún parámetro, se asume que el recurso es para usuarios con rol usuario convencional
    return SetMetadata(META_ROLES, args);
}