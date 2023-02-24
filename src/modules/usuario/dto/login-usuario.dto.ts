import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUsuarioDto {
    
    @ApiProperty({
        example: 'juanito@gmail.com',
        description: 'Correo electrónico del usuario',
        nullable: false,
    })
    @IsEmail({}, { message: 'El correo electrónico debe ser un correo electrónico válido' })
    @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
    correo: string;
    
    
    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario',
        nullable: false,
    })
    @IsString({ message: 'La contraseña debe ser un texto' })
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    password: string;
}
