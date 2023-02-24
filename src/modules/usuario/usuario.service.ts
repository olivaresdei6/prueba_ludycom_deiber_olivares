import {Injectable} from '@nestjs/common';
import {IDatabaseAbstract} from '../../framework/database/mysql/core/abstract';
import {JwtService} from '@nestjs/jwt';
import {CrearUsuarioDto, LoginUsuarioDto, ActualizarUsuarioDto} from './dto';
import {Usuario} from '../../framework/database/mysql/entities';
import {RolesPermitidos} from './interfaces/roles-permitidos';
import {v4 as uuidv4} from 'uuid';
import {ExceptionsService} from '../../config/exceptions/exceptions.service';
import {JwtPayload} from './interfaces/jwt.payload.interface';
import * as bcrypt from 'bcrypt';
import {EnvConfiguration} from "../../config/env.config";
import {RegistroDeAcceso} from "../../framework/database/mysql/entities";

@Injectable()
export class UsuarioService {
   
    constructor(
        private readonly baseDeDatos: IDatabaseAbstract,
        private readonly jwtService: JwtService,
        private readonly exceptions: ExceptionsService
    ) {}

    
    public async registrarUsuario(usuario: CrearUsuarioDto, isAdmin:boolean = false): Promise<Object> {
        const {password, ...usuarioSinPass} = usuario;
        if(!isAdmin){
            // Si no es admin, se debe validar que el area exista
            const areas = await this.baseDeDatos.area.findAll();
            if(!areas) this.exceptions.notFoundException({message: "No hay areas registradas. Por favor comuniquese con el administrador"})
        }
        return await this.baseDeDatos.usuario.create({
            ...usuarioSinPass,
            rol: RolesPermitidos.usuario_conencional,
            uuid: uuidv4(),
            estado: 1,
            password: bcrypt.hashSync(usuario.password, 10)
        });
    }


    public async iniciarSession({password, correo}: LoginUsuarioDto){
        const usuario: Usuario = await this.baseDeDatos.usuario.findOne({where: {correo}}, 'Usuario');
        if(!bcrypt.compareSync(password, usuario.password)) this.exceptions.unauthorizedException({message: 'Credenciales no validas'})
        const token: string = this.obtenerToken({uuid: usuario.uuid})
        const infoToken = await this.guardarInformacionDelToken(token, +usuario.id);
        delete usuario.password;
        return { message: 'Sección iniciada correctamente', usuario, infoToken}
    }

    public async cerrarSession(token: string): Promise<Object> {
        const {id}: RegistroDeAcceso = await this.baseDeDatos.registro_de_acceso.findOne({where: {token}}, 'Registro de acceso');
        await this.baseDeDatos.registro_de_acceso.update(+id, {fecha_salida: new Date()});
        return { message: 'Sección cerrada correctamente', token}
        
    }

    recuperarTodosLosUsuarios(page = 1, limit = 10) {
        return this.baseDeDatos.usuario.searchPaginatedCondition(page, limit, {});
    }



    async exportarSesiones(id_usuario: number) {
        const user: Usuario = await this.baseDeDatos.usuario.findOne({ where: { id: id_usuario } }, 'Usuario');
        const usuarios = (await this.baseDeDatos.usuario.executeQuery(`
            SELECT u.nombres, u.apellidos, u.correo, u.estado, u,rol, a.nombre as area from usuario
            join area on area.id = usuario.id_area
        `))[0];
        /*const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Sesiones');
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Nombre', key: 'nombre', width: 30 },
            { header: 'Apellido', key: 'apellido', width: 30 },
            { header: 'Correo', key: 'correo', width: 30 },
            { header: 'Area', key: 'correo', width: 30 },
            { header: 'Persona Encargada del area', key: 'correo', width: 30 },
        ];

        usuarios.forEach((sesion) => {
            worksheet.addRow({
                id: sesion.id,
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo,
                fecha_ingreso: sesion.fecha_ingreso,
                fecha_expiracion: sesion.fecha_expiracion,
                ip: sesion.ip
            });
        });

        return workbook;
        */

    }


    async exportarSesionesTodos() {
        /*const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Sesiones de todos los usuarios');
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Nombre', key: 'nombre', width: 30 },
            { header: 'Apellido', key: 'apellido', width: 30 },
            { header: 'Correo', key: 'correo', width: 30 },
            { header: 'Fecha de ingreso', key: 'fecha_ingreso', width: 30 },
            { header: 'Fecha de expiración', key: 'fecha_expiracion', width: 30 },
            { header: 'IP', key: 'ip', width: 30 },
        ];

        const sesionesDeTodosLosUsuarios: Object[] = await this.baseDeDatos.registrosDeUsuarios.findBy({}, {});
        
        sesionesDeTodosLosUsuarios.forEach( async (sesion) => {
            // @ts-ignore
            const {fecha_ingreso, fecha_expiracion, ip} = sesion;
            // @ts-ignore
            const {id, nombre, apellido, correo} = sesion.id_usuario;
            

            worksheet.addRow({ id, nombre, apellido, correo, fecha_ingreso, fecha_expiracion, ip });
        });

        return workbook;
        */

    }



    actualizarDatos(crearUsuarioDto: ActualizarUsuarioDto, id: number) {
        const {password} = crearUsuarioDto;
        if(password) crearUsuarioDto.password = bcrypt.hashSync(password, 10);
        return this.baseDeDatos.usuario.update(+id, crearUsuarioDto);
    }

    private obtenerToken(payload: JwtPayload) : string {
        return this.jwtService.sign(payload, {algorithm: 'HS512'});
    }
    
    private async obtenerInformacionDelToken(token: string) {
        const { exp, uuid } = this.jwtService.verify(token, {secret: EnvConfiguration().jwtSecret});
        return { exp, uuid };
    }
    
    private async guardarInformacionDelToken(token: string, id: number ) {
        const { exp } = await this.obtenerInformacionDelToken(token);
        
        return await this.baseDeDatos.registro_de_acceso.create({
            fecha_ingreso: ((new Date())),
            fecha_expiracion: ((new Date(exp * 1000))),
            token,
            usuario: id
        });
        
    }
    
    

}
