import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import {IDatabaseAbstract, IAreaRepository, IUsuarioRepository} from "./core/abstract";


import { MySQLAreaRepository, MySQLUsuarioRepository } from "./repositories";


import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Area, Usuario } from "./entities";

import {ExceptionsService} from "../../../config/exceptions/exceptions.service";


@Injectable()
export class MySQLDatabaseService implements IDatabaseAbstract, OnApplicationBootstrap {
    public usuario: IUsuarioRepository<Usuario>;
    public area: IAreaRepository<Area>;
    
    
    constructor(
        @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(Area) private readonly areaRepository: Repository<Area>,
        private readonly dataSource: DataSource
    ) {
    }
    
    /**
     *  onApplicationBootstrap es ún método de NestJS que se ejecuta despues de haber iniciado
     *  la aplicacion y se ha comprobado que no hay errores.
     */
    public onApplicationBootstrap() {
        this.usuario = new MySQLUsuarioRepository(this.usuarioRepository, this.dataSource, new ExceptionsService());
        this.area = new MySQLAreaRepository(this.areaRepository, this.dataSource, new ExceptionsService());
    };
}