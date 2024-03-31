/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PerguntaEntidade } from './pergunta.entity';
import { Comentario2Entidade } from './comentario2.entity';
import { VotoSalva2Entidade } from './votos-salvos2.entity';

@Entity({name: 'resposta'})
export class RespostaEntidade {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({name: 'voto', nullable: false})
    voto: number

    @Column({name: 'resposta', nullable: false})
    resposta: string

    @Column({name: 'usuarioResposta', nullable: false})
    usuarioResposta: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

    @ManyToOne(() => PerguntaEntidade, (pergunta) => pergunta.resposta,  {
        cascade: true,  onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    pergunta: PerguntaEntidade

    @OneToMany(() => Comentario2Entidade, (comentario) => comentario.resposta, {
      eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    comentario: Comentario2Entidade

    @OneToMany(() => VotoSalva2Entidade, (votos) => votos.resposta, {
      eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    votos2: VotoSalva2Entidade
}
