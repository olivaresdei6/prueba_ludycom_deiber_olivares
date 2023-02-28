import {IGenericRepository} from "./generic-repository.abstract";

export abstract class IUsuarioRepository<T> extends IGenericRepository<T> {
    public abstract agregarUsuario(usuario: T): Promise<T>;
}
