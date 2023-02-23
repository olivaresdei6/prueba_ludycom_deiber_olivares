import { RolesPermitidos } from "../interfaces/roles-permitidos";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role.guard";
import { RoleProtected } from './role-protected.decorator';

export const Auth = (...rolesPermitidos: RolesPermitidos[]) => {
    return  applyDecorators(
        RoleProtected(...rolesPermitidos),
        UseGuards(AuthGuard('jwt'), UserRoleGuard)
    )
}