import { Injectable } from "@nestjs/common";
import { MySQLGenericRepository } from "./mysql-generic.repository";
import { IAreaRepository } from "../core/abstract";

@Injectable()
export class MySQLAreaRepository<T> extends MySQLGenericRepository<T> implements IAreaRepository<T>
{
    
   
}