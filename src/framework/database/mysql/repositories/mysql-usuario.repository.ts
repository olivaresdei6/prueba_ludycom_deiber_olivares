import { Injectable } from "@nestjs/common";
import { MySQLGenericRepository } from "./mysql-generic.repository";
import { IUsuarioRepository } from "../core/abstract";

@Injectable()
export class MySQLUsuarioRepository<T> extends MySQLGenericRepository<T> implements IUsuarioRepository<T>
{
    
   
}