import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ExceptionsService } from "../../../config/exceptions/exceptions.service";

export const GetUser = createParamDecorator(
    ( data, ctx:ExecutionContext) => {
        const exceptions : ExceptionsService = new ExceptionsService();
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        if (!user) {
            exceptions.forbiddenException({message: 'Usuario no encontrado'});
        }
        return (!data) ? user : user[data];
    }
)