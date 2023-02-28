import {BadRequestException, Body, Controller, Get, Patch, Post, Query} from "@nestjs/common";
import {ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AreaService} from "./area.service";
import {CrearAreaDto} from "./dto/crear-area.dto";
import {Auth} from "../usuario/decorators/auth.decorator";
import {ActualizarAreaDto} from "./dto/actualizar-area.dto";
import {Area} from "../../framework/database/mysql/entities";

@Controller('areas')
@ApiTags('Areas')
@Auth()
export class AreaController {
    constructor( private readonly areaService: AreaService) {}
    
    @ApiResponse({ status: 201, description: 'Area registrada correctamente', type: Area })
    @ApiResponse({ status: 400, description: 'Bad Request: Verifique los datos de entrada' })
    @ApiResponse({ status: 401, description: 'Unauthorized: No tiene permisos para realizar esta acción' })
    @ApiResponse({ status: 403, description: 'Forbidden: Verifique que el token de autenticación sea válido y que no halla expirado.' })
    @ApiResponse({ status: 404, description: 'Not Found: El código de area no existe' })
    @Post()
    registrarArea(@Body() crearAreaDto: CrearAreaDto) {
        return this.areaService.crearArea(crearAreaDto);
    }
    
    
    @ApiResponse({ status: 201, description: 'Area encontrada correctamente', type: Area })
    @ApiResponse({ status: 400, description: 'Bad Request: Verifique los datos de entrada' })
    @ApiResponse({ status: 401, description: 'Unauthorized: No tiene permisos para realizar esta acción' })
    @ApiResponse({ status: 403, description: 'Forbidden: Verifique que el token de autenticación sea válido y que no halla expirado.' })
    @ApiResponse({ status: 404, description: 'Not Found: El código de area no existe' })
    @ApiQuery({ name: 'id', description:  'Id de la area', required: true, type: Number })
    @Get()
    recuperarArea(@Query('id') id: number) {
        if (!id) throw new BadRequestException('El id de la area es requerido')
        return this.areaService.obtenerArea(id);
    }
    
    @ApiResponse({ status: 201, description: 'Areas encontradas correctamente', type: Object })
    @ApiResponse({ status: 400, description: 'Bad Request: Verifique los datos de entrada' })
    @ApiResponse({ status: 401, description: 'Unauthorized: No tiene permisos para realizar esta acción' })
    @ApiResponse({ status: 403, description: 'Forbidden: Verifique que el token de autenticación sea válido y que no halla expirado.' })
    @ApiResponse({ status: 404, description: 'Not Found: El código de area no existe' })
    @ApiQuery({ name: 'page', description:  'Número de página', required: false, type: Number })
    @ApiQuery({ name: 'limit', description:  'Número de registros por página', required: false, type: Number })
    @Get('todas')
    recuperarAreas(@Query('page') page: number, @Query('limit') limit: number) {
        if (page && limit) return this.areaService.obtenerAreas(page, limit);
        if (page) return this.areaService.obtenerAreas(page);
        if (limit) return this.areaService.obtenerAreas(1, limit);
        return this.areaService.obtenerAreas();
    }
    
    @ApiResponse({ status: 201, description: 'Area actualizada correctamente', type: Object })
    @ApiResponse({ status: 400, description: 'Bad Request: Verifique los datos de entrada' })
    @ApiResponse({ status: 401, description: 'Unauthorized: No tiene permisos para realizar esta acción' })
    @ApiResponse({ status: 403, description: 'Forbidden: Verifique que el token de autenticación sea válido y que no halla expirado.' })
    @ApiResponse({ status: 404, description: 'Not Found: El código de area no existe' })
    @ApiQuery({ name: 'id', description:  'Id de la area', required: true, type: Number })
    @Patch('actualizar')
    actualizarArea(@Query('id') id: number, @Body() actualizarAreaDto: ActualizarAreaDto) {
        if (!id) throw new BadRequestException('El id de la area es requerido')
        return this.areaService.actualizarArea(id, actualizarAreaDto);
    }
    
    @ApiResponse({ status: 201, description: 'Area eliminada correctamente', type: Object })
    @ApiResponse({ status: 400, description: 'Bad Request: Verifique los datos de entrada' })
    @ApiResponse({ status: 401, description: 'Unauthorized: No tiene permisos para realizar esta acción' })
    @ApiResponse({ status: 403, description: 'Forbidden: Verifique que el token de autenticación sea válido y que no halla expirado.' })
    @ApiResponse({ status: 404, description: 'Not Found: El código de area no existe' })
    @ApiQuery({ name: 'id', description:  'Id de la area', required: true, type: Number })
    @Patch('eliminar')
    eliminarArea(@Query('id') id: number) {{
        if (!id) throw new BadRequestException('El id de la area es requerido')
        return this.areaService.eliminarArea(id);
    }
    }
    
    
}
