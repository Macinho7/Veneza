/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UsuarioMetaEntidade } from "./UsuarioMeta.entity";
import { ComentarioEntidade } from "./comentario.entity";
import { RespostaEntidade } from "./resposta.entity";
import { VotoSalvaEntidade } from "./voto.entity";
import { AdminstracaoPrestigioEVoteForceEntidade } from "./adminstracoe.entity";


@Entity({name: 'pergunta'})
export class PerguntaEntidade {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({name: "voto", nullable: false})
    voto: number

    @Column({name: "titulo", nullable: false})
    titulo: string

    @Column({name: "pergunta", nullable: false})
    pergunta: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

    @ManyToOne(() => UsuarioMetaEntidade, (usuarioMeta) => usuarioMeta.pergunta, {
        cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    usuario: UsuarioMetaEntidade

    @OneToMany(() => ComentarioEntidade, (comentario) => comentario.pergunta, {
        eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    comentario: ComentarioEntidade

    @OneToMany(() => RespostaEntidade, (resposta) => resposta.pergunta, {
        eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    resposta: RespostaEntidade[]
    @OneToMany(() => VotoSalvaEntidade, (resposta) => resposta.pergunta, {
        eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    votos: VotoSalvaEntidade

    @OneToMany(() => AdminstracaoPrestigioEVoteForceEntidade, (administracao) => administracao.pergunta, {
        eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    administracao: AdminstracaoPrestigioEVoteForceEntidade

 
}
