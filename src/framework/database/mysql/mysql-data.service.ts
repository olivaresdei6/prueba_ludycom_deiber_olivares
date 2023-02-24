import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import {IDatabaseAbstract, IAreaRepository, IUsuarioRepository, IRegistroDeAccesoRepository} from "./core/abstract";
import { MySQLAreaRepository, MySQLUsuarioRepository, MySQLRegistroDeAccesoRepository } from "./repositories";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Area, Usuario, RegistroDeAcceso } from "./entities";

import {ExceptionsService} from "../../../config/exceptions/exceptions.service";


@Injectable()
export class MySQLDatabaseService implements IDatabaseAbstract, OnApplicationBootstrap {
    public usuario: IUsuarioRepository<Usuario>;
    public area: IAreaRepository<Area>;
    public registro_de_acceso: IRegistroDeAccesoRepository<RegistroDeAcceso>;
    
    
    constructor(
        @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(RegistroDeAcceso) private readonly registroDeAccesoRepository: Repository<RegistroDeAcceso>,
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
        this.registro_de_acceso = new MySQLRegistroDeAccesoRepository(this.registroDeAccesoRepository, this.dataSource, new ExceptionsService());
    };
}
