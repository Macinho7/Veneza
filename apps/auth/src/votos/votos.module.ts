/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibModule, rmqModule } from '@app/lib';
import { VotoSalvaEntidade } from '../Entidades/voto.entity';
import { RespostaEntidade } from '../Entidades/resposta.entity';
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { ComentarioEntidade } from '../Entidades/comentario.entity';
import { PerguntaEntidade } from '../Entidades/pergunta.entity';
import { ComentarioModule } from '../comentario/comentario.module';
import { PerguntaModule } from '../pergunta/pergunta.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ PerguntaEntidade, ComentarioEntidade, UsuarioMetaEntidade, RespostaEntidade, VotoSalvaEntidade]), forwardRef(() => UsuarioMetaEntidade), forwardRef(() => ComentarioModule), forwardRef(() => PerguntaModule),
  
    rmqModule,
    LibModule,
  ],
  controllers: [],
  providers: [],
})
export class VotosModule {}
