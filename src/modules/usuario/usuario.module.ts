import { Module } from '@nestjs/common';
import { MySQLDatabaseModule } from "../../framework/database/mysql/mysql-data.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { EnvConfiguration } from "../../config/env.config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { ExceptionsModule } from '../../config/exceptions/exceptions.module';

@Module({
    controllers: [UsuarioController],
    providers: [UsuarioService, JwtStrategy],
    exports:  [UsuarioService, JwtStrategy, PassportModule, JwtModule],
    imports: [
        ExceptionsModule,
        MySQLDatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [],
            inject: [],
            useFactory: () => {
                return {
                    secret: EnvConfiguration().jwtSecret,
                    signOptions: { expiresIn: '7d', algorithm: 'HS512' }
                }
            }
        }),
    ],
    
})
export class UsuarioModule {}
