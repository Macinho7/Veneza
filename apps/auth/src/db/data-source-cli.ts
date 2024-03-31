/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from 'typeorm'
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { ComentarioEntidade } from '../Entidades/comentario.entity';
import { PerguntaEntidade } from '../Entidades/pergunta.entity';
import { RespostaEntidade } from '../Entidades/resposta.entity';
import { Comentario2Entidade } from '../Entidades/comentario2.entity';
import { VotoSalvaEntidade } from '../Entidades/voto.entity';
import { VotoSalva2Entidade } from '../Entidades/votos-salvos2.entity';
import { AdminstracaoPrestigioEVoteForceEntidade } from '../Entidades/adminstracoe.entity';
import { AdminstrarValorSignificativoEntidade } from '../Entidades/adminstrar-valor-significativo.entity';


const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  entities: [UsuarioMetaEntidade, PerguntaEntidade, ComentarioEntidade, RespostaEntidade, Comentario2Entidade, VotoSalvaEntidade, VotoSalva2Entidade, AdminstracaoPrestigioEVoteForceEntidade, AdminstrarValorSignificativoEntidade],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions)

export {dataSource}
