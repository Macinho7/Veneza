/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RespostaEntidade } from "./resposta.entity";

@Entity({name: 'comentario2'})
export class Comentario2Entidade {
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

    @ManyToOne(() => RespostaEntidade, (pergunta) => pergunta.comentario, {
        cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    resposta: RespostaEntidade
}