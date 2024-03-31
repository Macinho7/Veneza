/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { ComentarioController } from './comentario.controller';
import { PerguntaModule } from '../pergunta/pergunta.module';
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { PerguntaEntidade } from '../Entidades/pergunta.entity';
import { ComentarioEntidade } from '../Entidades/comentario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibModule, rmqModule } from '@app/lib';
import { RespostaModule } from '../resposta/resposta.module';
import { RespostaEntidade } from '../Entidades/resposta.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([ PerguntaEntidade, ComentarioEntidade, UsuarioMetaEntidade, RespostaEntidade]), forwardRef(() => UsuarioMetaEntidade), forwardRef(() => PerguntaModule),forwardRef(() => RespostaModule) ,
  
    rmqModule,
    LibModule
  ],
  controllers: [ComentarioController],
  providers: [ComentarioService],
})
export class ComentarioModule {}
