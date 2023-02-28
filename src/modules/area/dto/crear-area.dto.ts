import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength} from 'class-validator';


export class CrearAreaDto {
    
    @ApiProperty({
        description: 'Nombre del area',
        example: 'Finanzas',
        required: true,
    })
    @IsString({ message: 'El nombre del area debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre del area no puede estar vacío' })
    @MinLength(3, { message: 'El nombre del area debe tener al menos 3 caracteres' })
    nombre: string;
    
    @ApiProperty({
        description: 'Id del usuario encargado del area',
        example: 1,
        required: true,
    })
    @IsNotEmpty({ message: 'El id del usuario no puede estar vacío' })
    @IsNumber({}, { message: 'El id del usuario debe ser un número' })
    id_lider: number;
    
    
}
