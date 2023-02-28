import {Injectable} from "@nestjs/common";
import {IDatabaseAbstract} from "../../framework/database/mysql/core/abstract";
import {CrearAreaDto} from "./dto/crear-area.dto";
import {ActualizarAreaDto} from "./dto/actualizar-area.dto";

@Injectable()
export class AreaService {
    constructor(
        private readonly baseDeDatos: IDatabaseAbstract,
    ) {}
    
    public async crearArea(area: CrearAreaDto): Promise<Object> {
        return await this.baseDeDatos.area.create({...area, estado: 1, lider: area.id_lider});
    }
    
    public async obtenerAreas(page = 1, limit = 10): Promise<Object> {
        return await this.baseDeDatos.area.searchPaginatedCondition(page, limit, {});
    }
    
    public async obtenerArea(id: number): Promise<Object> {
        return await this.baseDeDatos.area.findOne({where: {id}}, 'Area');
    }
    
    public async actualizarArea(id: number, actualizarAreaDto: ActualizarAreaDto): Promise<Object> {
        return await this.baseDeDatos.area.update(id, {...actualizarAreaDto, lider: actualizarAreaDto.id_lider});
    }
    
    public async eliminarArea(id: number): Promise<Object> {
        return await this.baseDeDatos.area.update(id, {estado: 0});
    }
    
}
