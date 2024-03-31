/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PerguntaEntidade } from './pergunta.entity';

@Entity({ name: 'votos' })
export class VotoSalvaEntidade {
    @PrimaryGeneratedColumn('uuid')
    id: string


    @Column({nullable: false, name: 'idUsuario'})
    idUsuario: string

    @Column({nullable: false, name: 'idPergunta'})
    idPergunta: string

    @Column({nullable: false, name: 'valorVoto'})
    valorVoto: number

    @ManyToOne(() => PerguntaEntidade, (pergunta) => pergunta.votos,  {
        cascade: true,  onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    pergunta: PerguntaEntidade
}
