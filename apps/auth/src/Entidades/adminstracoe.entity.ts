/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PerguntaEntidade } from './pergunta.entity';

@Entity({ name: 'administracao' })
export class AdminstracaoPrestigioEVoteForceEntidade {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false, name: 'idUsuarioPrestigiado'})
    idUsuarioPrestigiado: string

    @Column({nullable: false, name: 'idPergunta'})
    idPergunta: string

    @Column({nullable: false, name: 'valorPrestigio'})
    valorPrestigio: number

    @Column({nullable: false, name: 'valorVoteForce'})
    valorVoteForce: number

    @ManyToOne(() => PerguntaEntidade, (pergunta) => pergunta.administracao,  {
        cascade: true,  onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    pergunta: PerguntaEntidade

}
