import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Usuario } from './usuario.entity';

@Entity({ name: 'registro_de_acceso' })
export class RegistroDeAcceso {
    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada registro de usuario',
    })
    @PrimaryGeneratedColumn('increment', { type: 'bigint'})
    id?: number;
    
    @ApiProperty({
        example: 1,
        description: 'Identificador único del usuario',
    })
    // LPara que muestra el id del usuario al hacer el get hay que ponerle eager: true
    @ManyToOne(() => Usuario, usuario => usuario.registrosDeAccesos, { eager: true })
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuario | number;
    
    @ApiProperty({
        example: '2021-01-01 00:00:00',
        description: 'Fecha de ingreso al sistema',
    })
    @Column('timestamp', {
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    fecha_ingreso!: Date;
    
    @ApiProperty({
        example: '2021-01-01 00:00:00',
        description: 'Fecha de salida del sistema',
    })
    @Column('timestamp', {
        nullable: true,
    })
    fecha_salida?: Date;
    
    
    @ApiProperty({
        description: 'Token de acceso',
        example: 'tjnkjb-3j4n3-4j3n4-3j4n3-4j3n4',
    })
    @Column('varchar', {
        nullable: false,
        length: 500,
    })
    token!: string;
    
    
    @ApiProperty({
        example: '2021-01-01 00:00:00',
        description: 'Fecha de expiración del token',
    })
    @Column('timestamp', {
        nullable: false,
    })
    fecha_expiracion!: Date;
}
