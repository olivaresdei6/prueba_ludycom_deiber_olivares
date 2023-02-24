import {IUsuarioRepository, IAreaRepository, IRegistroDeAccesoRepository} from "./";
import {Usuario, Area, RegistroDeAcceso} from '../../entities';


export abstract class IDatabaseAbstract {
    public abstract readonly usuario: IUsuarioRepository<Usuario>;
    public abstract readonly area: IAreaRepository<Area>;
    public abstract registro_de_acceso: IRegistroDeAccesoRepository<RegistroDeAcceso>;
}
