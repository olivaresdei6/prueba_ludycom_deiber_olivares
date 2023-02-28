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
import * as excel from 'exceljs';

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
        const usuario_insertado = await this.baseDeDatos.usuario.create({
            ...usuarioSinPass,
            rol: isAdmin ? RolesPermitidos.administrador : RolesPermitidos.usuario_conencional,
            uuid: uuidv4(),
            estado: 1,
            password: bcrypt.hashSync(usuario.password, 10),
            area: usuario.id_area
        });
        delete usuario_insertado.password;
        return {
            message: 'Usuario registrado correctamente',
            usuario: {
                ...usuario_insertado,
                area: usuario.id_area
            }
        }
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

    async recuperarTodosLosUsuarios(page = 1, limit = 10) {
        const usuarios = (await this.baseDeDatos.usuario.searchPaginatedCondition(page, limit, {estado: 1}))[0][0];
        let usuariosFormateados = [];
        for (let usuario of usuarios) {
            delete usuario.password;
            const {area} = usuario;
            const area_del_usuario = await this.baseDeDatos.area.findOne({where: {id: area}}, 'Area');
            // @ts-ignore
            delete area_del_usuario.lider.password;
            usuariosFormateados.push({
                ...usuario,
                area: area_del_usuario
            })
        }
        return usuariosFormateados;
    }
    
    eliminarUsuario(id: number) {
        return this.baseDeDatos.usuario.update(id, {estado: 0});
    }



    async exportarUsuarios() {
        const usuarios = await this.baseDeDatos.usuario.findAll();
        let usuariosFormateados = [];
        for (let usuario of usuarios) {
            delete usuario.password;
            const {area} = usuario;
            const area_del_usuario = await this.baseDeDatos.area.findOne({where: {id: area}}, 'Area');
            // @ts-ignore
            delete area_del_usuario.lider.password;
            usuariosFormateados.push({
                id: usuario.id,
                nombres: usuario.nombre,
                apellidos: usuario.apellido,
                correo: usuario.correo,
                nro_de_documento: usuario.nro_de_documento || 'No especificado',
                salario: usuario.salario || 'No especificado',
                estado: usuario.estado === 1 ? 'Activo' : 'Inactivo',
                area: area_del_usuario.nombre,
                // @ts-ignore
                lider_de_area: `${area_del_usuario.lider.nombre} ${area_del_usuario.lider.apellido}`,
                rol: usuario.rol === RolesPermitidos.administrador ? 'Administrador' : 'Usuario'
            })
        }
        console.log(usuariosFormateados);
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Sesiones');
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Nombres', key: 'nombres', width: 30 },
            { header: 'Apellidos', key: 'apellidos', width: 30 },
            { header: 'Correo', key: 'correo', width: 30 },
            { header: 'N° de Documento', key: 'nro_de_documento', width: 30 },
            { header: 'Salario', key: 'salario', width: 30 },
            { header: 'Area de trabajo', key: 'area', width: 30 },
            { header: 'Lider Encargado del area', key: 'lider_de_area', width: 30 },
            { header: 'Rol', key: 'rol', width: 30 },
            { header: 'Estado', key: 'estado', width: 30 },
        ];
        usuariosFormateados.forEach((usuario) => {
            worksheet.addRow({
                id: usuario.id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                correo: usuario.correo,
                nro_de_documento: usuario.nro_de_documento,
                salario: usuario.salario,
                area: usuario.area,
                lider_de_area: usuario.lider_de_area,
                rol: usuario.rol,
                estado: usuario.estado
            });
        });

        return workbook;

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
