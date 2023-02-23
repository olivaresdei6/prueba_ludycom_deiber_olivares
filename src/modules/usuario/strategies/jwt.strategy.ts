import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Usuario } from "../../../framework/database/mysql/entities";
import { JwtPayload } from "../interfaces/jwt.payload.interface";
import { IDatabaseAbstract } from "../../../framework/database/mysql/core/abstract";
import { ExtractJwt } from "passport-jwt";
import { EnvConfiguration } from "../../../config/env.config";
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    /**
     * El Passport Strategy es un decorador que nos permite revisar el token basado en la clave secreta
     * y si ha expirado o no. Mientras que la estrategia me va a permitir revisar el token y si es válido
     * o no.
     */
    
    constructor( private readonly databaseService : IDatabaseAbstract) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: EnvConfiguration().jwtSecret,
        });
    }
    
    async validate(payload: JwtPayload) : Promise<Usuario> {
        const {  uuid } = payload;
        const usuario = await this.databaseService.usuario.findOne({ where: { uuid} }, 'Usuario');
        if (!usuario || usuario.estado !== 1) {
            throw new NotFoundException('Token no valido' );
        }
        return usuario;
    }
}