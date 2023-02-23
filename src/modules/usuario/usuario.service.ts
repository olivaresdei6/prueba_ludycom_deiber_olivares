import { Injectable, BadRequestException } from '@nestjs/common';
import { IDatabaseAbstract } from '../../framework/database/mysql/core/abstract';
import { JwtService } from '@nestjs/jwt';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { EnvConfiguration } from '../../config/env.config';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import * as excel from 'exceljs';
import { Usuario } from '../../framework/database/mysql/entities/usuario.entity';
import { RolesPermitidos } from './interfaces/roles-permitidos';
import { v4 as uuidv4 } from 'uuid';
import { ExceptionsService } from '../../config/exceptions/exceptions.service';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsuarioService {
   
    constructor(
        private readonly baseDeDatos: IDatabaseAbstract,
        private readonly jwtService: JwtService,
        private readonly exeptions: ExceptionsService
    ) {}

    
    public async registrarUsuario(usuario: CrearUsuarioDto): Promise<Object> {
        const {password, ...usuarioSinPass} = usuario;
        // Primero se verifica si hay areas registradas
        const password_encriptada = bcrypt.hashSync(password, 10);
        
        
        const areas = await this.baseDeDatos.area.findAll();
        if(!areas) this.exeptions.notFoundException({message: "No hay areas registradas. Por favor comuniquese con el administrador"})
        const usuarioARegistrar = await this.baseDeDatos.usuario.create({
            ...usuarioSinPass, 
            rol: RolesPermitidos.usuario_conencional,
            uuid: uuidv4(),
            estado: 1,
            password: password_encriptada
        })
        return usuarioARegistrar;
    }

    public async registrarAdmin(usuario: CrearUsuarioDto): Promise<Object> {
        const usuarioARegistrar = await this.baseDeDatos.usuario.create({
            ...usuario, 
            rol: RolesPermitidos.administrador,
            uuid: uuidv4(),
            estado: 1,
            password: bcrypt.hashSync(usuario.password, 10)
        })
        return usuarioARegistrar;
    }


    public async iniciarSesion(usuario: LoginUsuarioDto){
        console.log(usuario);
        
        const usuarioAIniciarSesion: Usuario = await this.baseDeDatos.usuario.findOne({where: {correo: usuario.email}}, 'Usuario');
        console.log(usuarioAIniciarSesion);
        
        if(!bcrypt.compareSync(usuario.password, usuarioAIniciarSesion.password)) this.exeptions.unauthorizedException({message: 'Credenciales no validas'})
        const token: string = this.obtenerToken({uuid: usuarioAIniciarSesion.uuid})
        await this.baseDeDatos.usuario.update(usuarioAIniciarSesion.uuid, {token})
        delete usuarioAIniciarSesion.password;
        return { message: 'Sección iniciada correctamente', token, usuario: usuarioAIniciarSesion}
    }

    public async cerrarSesion(token: string): Promise<Object> {
        const usuario: Usuario = await this.baseDeDatos.usuario.findOne({where: {token}}, 'Usuario');
        await this.baseDeDatos.usuario.update(usuario.id, {token: null})
        return { message: 'Sección cerrada correctamente', token}
        
    }

    recuperarTodosLosUsuarios() {
        return this.baseDeDatos.usuario.findAll();
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
        return this.baseDeDatos.usuario.update(+id, crearUsuarioDto);
    }

    private obtenerToken(payload: JwtPayload) : string {
        console.log(payload);
        
        return this.jwtService.sign(payload, {algorithm: 'HS512'});
    }

}