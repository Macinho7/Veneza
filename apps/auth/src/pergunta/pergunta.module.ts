/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { PerguntaService } from './pergunta.service';
import { PerguntaController } from './pergunta.controller';
import { PerguntaEntidade } from '../Entidades/pergunta.entity';
import { ComentarioEntidade } from '../Entidades/comentario.entity';
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibModule, rmqModule } from '@app/lib';
import { ComentarioModule } from '../comentario/comentario.module';
import { RespostaEntidade } from '../Entidades/resposta.entity';
import { RespostaModule } from '../resposta/resposta.module';
import { VotoSalvaEntidade } from '../Entidades/voto.entity';
import { VotosModule } from '../votos/votos.module';
import { AdminstracaoPrestigioEVoteForceEntidade } from '../Entidades/adminstracoe.entity';
import { AdminstracoesModule } from '../adminstracoes/adminstracoes.module';
import { AdminstrarValorSignificativoEntidade } from '../Entidades/adminstrar-valor-significativo.entity';
import { AdminstrarValorSignificativoModule } from '../adminstrar-valor-significativo/adminstrar-valor-significativo.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([ PerguntaEntidade, ComentarioEntidade, UsuarioMetaEntidade, RespostaEntidade, VotoSalvaEntidade, AdminstracaoPrestigioEVoteForceEntidade, AdminstrarValorSignificativoEntidade]), forwardRef(() => UsuarioMetaEntidade), forwardRef(() => ComentarioModule), forwardRef(() => RespostaModule), forwardRef(() => VotosModule), forwardRef(() => AdminstracoesModule  ), forwardRef(() => AdminstrarValorSignificativoModule  ),
  
    rmqModule,
    LibModule,
  ],
  controllers: [PerguntaController],
  providers: [PerguntaService],
})
export class PerguntaModule {}
