import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import {Usuario} from "./";

@Entity({ name: 'area' })
export class Area {
    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada area',
    })
    @PrimaryGeneratedColumn('increment', { type: 'bigint'})
    id?: number;

    @ApiProperty({
        example: 'Juan',
        description: 'Nombre del usuario',
    })
    @Column('varchar', {
        nullable: false,
        length: 50,
        unique: true,
    })
    nombre!: string;


    @ApiProperty({
        example: '2021-10-10',
        description: 'Fecha de creación del usuario',
    })
    @Column('timestamp', {
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    fecha_de_creacion?: Date;

    @ApiProperty({
        example: '2021-10-10',
        description: 'Fecha de actualización del usuario',
    })
    @Column('timestamp', {
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    fecha_de_actualizacion?: Date;

    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada estado',
    })
    @Column('int', {
        nullable: false,
        default: 1,
    })
    estado?: number;


    @OneToMany(() => Usuario, usuario => usuario.area)
    usuarios?: Usuario[];

    @ManyToOne(() => Usuario, usuarioArea => usuarioArea.areas, {eager: true})
    @JoinColumn({name: "id_lider"})
    lider:Usuario | number;
}
