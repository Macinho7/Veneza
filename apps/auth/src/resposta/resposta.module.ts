/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { RespostaService } from './resposta.service';
import { RespostaController } from './resposta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibModule, rmqModule } from '@app/lib';
import { RespostaEntidade } from '../Entidades/resposta.entity';
import { PerguntaEntidade } from '../Entidades/pergunta.entity';
import { ComentarioEntidade } from '../Entidades/comentario.entity';
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { ComentarioModule } from '../comentario/comentario.module';
import { PerguntaModule } from '../pergunta/pergunta.module';
import { VotoSalva2Entidade } from '../Entidades/votos-salvos2.entity';
import { VotosSalvos2Module } from '../votos-salvos2/votos-salvos2.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ PerguntaEntidade, ComentarioEntidade, UsuarioMetaEntidade, RespostaEntidade, VotoSalva2Entidade]), forwardRef(() => UsuarioMetaEntidade), forwardRef(() => ComentarioModule), forwardRef(() => PerguntaModule), forwardRef(() => VotosSalvos2Module ),
  
    rmqModule,
    LibModule,
  ],
  controllers: [RespostaController],
  providers: [RespostaService],
})
export class RespostaModule {}
