/* eslint-disable prettier/prettier */
import { LibModule, rmqModule } from '@app/lib';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerguntaEntidade } from '../Entidades/pergunta.entity';
import { ComentarioEntidade } from '../Entidades/comentario.entity';
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { RespostaEntidade } from '../Entidades/resposta.entity';
import { VotoSalvaEntidade } from '../Entidades/voto.entity';
import { AdminstracaoPrestigioEVoteForceEntidade } from '../Entidades/adminstracoe.entity';
import { PerguntaModule } from '../pergunta/pergunta.module';
import { ComentarioModule } from '../comentario/comentario.module';
import { VotosModule } from '../votos/votos.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([ PerguntaEntidade, ComentarioEntidade, UsuarioMetaEntidade, RespostaEntidade, VotoSalvaEntidade, AdminstracaoPrestigioEVoteForceEntidade]), forwardRef(() => UsuarioMetaEntidade), forwardRef(() => ComentarioModule), forwardRef(() => PerguntaModule), forwardRef(() => VotosModule),
  
    rmqModule,
    LibModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminstracoesModule {}
