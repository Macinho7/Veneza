/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { Comentario2Service } from './comentario2.service';
import { Comentario2Controller } from './comentario2.controller';
import { LibModule, rmqModule } from '@app/lib';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerguntaEntidade } from '../Entidades/pergunta.entity';
import { ComentarioEntidade } from '../Entidades/comentario.entity';
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { RespostaEntidade } from '../Entidades/resposta.entity';
import { Comentario2Entidade } from '../Entidades/comentario2.entity';
import { PerguntaModule } from '../pergunta/pergunta.module';
import { RespostaModule } from '../resposta/resposta.module';
import { ComentarioModule } from '../comentario/comentario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ PerguntaEntidade, ComentarioEntidade, UsuarioMetaEntidade, RespostaEntidade, Comentario2Entidade]), forwardRef(() => UsuarioMetaEntidade), forwardRef(() => PerguntaModule),forwardRef(() => RespostaModule), forwardRef(()=> ComentarioModule) ,
  
    rmqModule,
    LibModule,
  ],
  controllers: [Comentario2Controller],
  providers: [Comentario2Service],
})
export class Comentario2Module {}
