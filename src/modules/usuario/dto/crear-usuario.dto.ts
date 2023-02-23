import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from 'class-validator';


export class CrearUsuarioDto {

    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan',
        required: true,
    })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    nombre: string;

    @ApiProperty({
        description: 'Apellido del usuario',
        example: 'Perez',
        required: true,
    })
    @IsString({ message: 'El apellido debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
    @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
    apellido: string;

    @ApiProperty({
        example: '2001-12-11',
        description: 'Fecha de naciniento'
    })
    @IsNotEmpty({ message: 'La fecha de nacimiento no puede estar vacía' })
    fecha_de_nacimiento: Date;

    @ApiProperty({
        description: 'Correo del usuario',
        example: 'correo@correo.com',
        required: true,
    })
    @IsString({ message: 'El correo debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El correo no puede estar vacío' })
    @MinLength(3, { message: 'El correo debe tener al menos 3 caracteres' })
    @IsEmail({}, { message: 'El correo debe ser un correo válido' })
    correo: string;


    @ApiProperty({
        description: 'Contraseña del usuario',
        example: '123456',
        required: true,
    })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

}