/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PerguntaEntidade } from "./pergunta.entity";

@Entity({name: 'comentario'})
export class ComentarioEntidade {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({name: "nomeUsuario", nullable: false})
    nomeUsuario: string

    @Column({name: "comentario", nullable: false})
    comentario: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

    @ManyToOne(() => PerguntaEntidade, (pergunta) => pergunta.comentario, {
        cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    pergunta: PerguntaEntidade
}
