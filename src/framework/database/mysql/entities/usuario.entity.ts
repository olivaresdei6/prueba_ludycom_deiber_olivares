import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Area } from "./";

@Entity({ name: 'usuario' })
export class Usuario {
    @ApiProperty({
        example: 1,
        description: 'Identificador único de cada usuario',
    })
    @PrimaryGeneratedColumn('increment', { type: 'bigint'})
    id?: number;

    @ApiProperty({
        example: 'ggrvs-bnmjbvnjb-hghgffdgfhg',
        description: 'Código único de cada usuario (UUID)',	
    })
    @Column('varchar', {
        nullable: true,
        length: 100,
        unique: true,
    })
    uuid?: string;

    @ApiProperty({
        description: "Token del usuario"
    })
    @Column('varchar', {
        length: 500,
        nullable: true
    })
    token?: string;

    @ApiProperty({
        example: 'Juan',
        description: 'Nombre del usuario',
    })
    @Column('varchar', {
        nullable: false,
        length: 50,
    })
    nombre!: string;

    @ApiProperty({
        example: 'Perez',
        description: 'Apellido del usuario',
    })
    @Column('varchar', {
        nullable: false,
        length: 50,
    })
    apellido!: string;


    @ApiProperty({
        example: '10-09-2001',
        description: 'Fecha de nacimiento del usuario'
    })
    @Column('date', {
        nullable: false
    })
    fecha_de_nacimiento


    @ApiProperty({
        example: 'correo@correo.com',
        description: 'Correo del usuario',
    })
    @Column('varchar', {
        nullable: false,
        length: 100,
        unique: true,
    })
    correo!: string;



    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario',
    })
    @Column('varchar', {
        nullable: false,
        length: 100,
    })
    password!: string;

    @Column('varchar', {
        nullable: false,
    })
    rol!: string;

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

    @OneToMany(() => Area, area => area.id_lider)
    areas?: Area[];

    @ManyToOne(() => Area, areas => areas.usuarios, {nullable: true})
    @JoinColumn({name: "id_area"})
    id_area: number;
}

