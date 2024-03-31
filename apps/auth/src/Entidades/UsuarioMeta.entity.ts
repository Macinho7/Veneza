/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PerguntaEntidade } from "./pergunta.entity";
import { AdminstrarValorSignificativoEntidade } from "./adminstrar-valor-significativo.entity";

@Entity({name: 'Usuario'})
export class UsuarioMetaEntidade {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({name: "nome", nullable: false})
    nome: string
    
    @Column({name: "email", nullable: false})
    email: string

    
    @Column({name: "senha", nullable: false})
    senha: string

    @Column({name: "prestigio", nullable: false})
    prestigio: number

    @Column({name: "voteForce", nullable: false})
    voteForce: number

    @Column({name: "valorSignificativo", nullable: false, default: 0})
    valorSignificativo: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

    @OneToMany(() => PerguntaEntidade, (pergunta) => pergunta.usuario, {
        eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    pergunta: PerguntaEntidade[]

    @OneToMany(() => AdminstrarValorSignificativoEntidade, (adm) => adm.usuario, {
        eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    admValorSignificativo: AdminstrarValorSignificativoEntidade
}