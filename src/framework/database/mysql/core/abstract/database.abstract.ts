import { IUsuarioRepository, IAreaRepository } from "./";
import { Usuario, Area } from '../../entities';


export abstract class IDatabaseAbstract {
    public abstract readonly usuario: IUsuarioRepository<Usuario>;
    public abstract readonly area: IAreaRepository<Area>;
}