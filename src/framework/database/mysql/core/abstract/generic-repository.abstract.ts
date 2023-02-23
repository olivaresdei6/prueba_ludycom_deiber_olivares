import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { DeepPartial, FindOneOptions } from "typeorm";

export abstract class IGenericRepository<T> {
    
    public abstract findAll(where?:object,relations?:string[]): Promise<T[]>;
    
    public abstract findOne(options: FindOneOptions<T>, entity: string, ignoreAuth?:boolean): Promise<T | null>;
    
    public abstract searchPaginatedCondition(page: number, limit: number, where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<[T[], number]>;
    
    public abstract findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[], options?: FindOneOptions<T>): Promise<T[]>;
    
    public abstract searchAll(value: string, column: string, order?: string, limit?: number, page?: number): Promise<Object>;
    
    public abstract create(entity: DeepPartial<T>): Promise<T>;
    
    public abstract update(id: string | number, entity: DeepPartial<T>): Promise<T>;
    
    public abstract executeQuery(query: string): Promise<any>;
        
    public abstract getRegistersPaginated(limit: number, page: number, table: string): Promise<Object>;
    
    public abstract generateCodeUuId(): string;
}
