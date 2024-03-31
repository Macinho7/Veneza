/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioMetaEntidade } from './UsuarioMeta.entity';

@Entity({ name: 'admValorSignificativo' })
export class AdminstrarValorSignificativoEntidade {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false, name: 'idUsuarioPrestigiado'})
    idUsuarioPrestigiado: string

    @Column({nullable: false, name: 'idPergunta'})
    idPergunta: string

    @Column({nullable: false, name: 'valorSignificativoHR'})
    valorSignificativoHR: number

    @ManyToOne(() => UsuarioMetaEntidade, (usuario) => usuario.admValorSignificativo,  {
        cascade: true,  onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    usuario: UsuarioMetaEntidade
}
