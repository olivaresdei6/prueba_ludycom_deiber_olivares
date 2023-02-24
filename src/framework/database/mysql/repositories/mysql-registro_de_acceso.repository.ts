import { Injectable } from "@nestjs/common";
import { MySQLGenericRepository } from "./mysql-generic.repository";
import { IRegistroDeAccesoRepository } from "../core/abstract";

@Injectable()
export class MySQLRegistroDeAccesoRepository<T> extends MySQLGenericRepository<T> implements IRegistroDeAccesoRepository<T> {
    
   
}
