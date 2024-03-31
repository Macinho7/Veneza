/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RespostaEntidade } from './resposta.entity';

@Entity({ name: 'votos2' })
export class VotoSalva2Entidade {
    @PrimaryGeneratedColumn('uuid')
    id: string


    @Column({nullable: false, name: 'idUsuario'})
    idUsuario: string

    @Column({nullable: false, name: 'idPergunta'})
    idPergunta: string

    @Column({nullable: false, name: 'valorVoto'})
    valorVoto: number

    @ManyToOne(() => RespostaEntidade, (pergunta) => pergunta.votos2,  {
        cascade: true,  onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    resposta: RespostaEntidade
}
