import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDatabaseAbstract } from './core/abstract';
import * as entities from './entities';
import { EnvConfiguration } from "../../../config/env.config";
import { MySQLDatabaseService } from './mysql-data.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forRoot({})],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: 'mysql',
                    host: EnvConfiguration().host,
                    port: EnvConfiguration().mysqlPort,
                    username: EnvConfiguration().mysqlUser,
                    password: EnvConfiguration().mysqlPassword,
                    database: EnvConfiguration().mysqlDatabase,
                    synchronize: true,
                    /* Logging sirve para ver las consultas que se hacen a la base de datos */
                    logging: false,
                    /* autoLoadEntities sirve para que no sea necesario importar las entidades en el archivo app.module.ts */
                    autoLoadEntities: true,
                    entities: Object.values(entities),
                    migrations: ['dist/database/migrations/*.js'],
                    subscribers: ['dist/observers/subscribers/*.subscriber.js'],
                    cli: {
                        entitiesDir: 'src/modules/**/entity',
                        migrationsDir: 'src/database/migrations',
                        subscribersDir: 'src/observers/subscribers',
                    },
                };
            },
        }),
        TypeOrmModule.forFeature(Object.values(entities)),
    ],
    providers: [
        {
            provide: IDatabaseAbstract,
            useClass: MySQLDatabaseService,
        },
    ],
    exports: [IDatabaseAbstract],
})
export class MySQLDatabaseModule {}