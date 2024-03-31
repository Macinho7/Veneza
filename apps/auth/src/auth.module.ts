/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LibModule, rmqModule } from '@app/lib';
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PerguntaModule } from './pergunta/pergunta.module';
import { ComentarioModule } from './comentario/comentario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerguntaEntidade } from './Entidades/pergunta.entity';
import { ComentarioEntidade } from './Entidades/comentario.entity';
import { UsuarioMetaEntidade } from './Entidades/UsuarioMeta.entity';
import { RespostaModule } from './resposta/resposta.module';
import { RespostaEntidade } from './Entidades/resposta.entity';
import { Comentario2Module } from './comentario2/comentario2.module';
import { VotosModule } from './votos/votos.module';
import { VotosSalvos2Module } from './votos-salvos2/votos-salvos2.module';
import { AdminstracoesModule } from './adminstracoes/adminstracoes.module';
import { AdminstracaoPrestigioEVoteForceEntidade } from './Entidades/adminstracoe.entity';
import { Comentario2Entidade } from './Entidades/comentario2.entity';
import { AdminstrarValorSignificativoModule } from './adminstrar-valor-significativo/adminstrar-valor-significativo.module';
import { AdminstrarValorSignificativoEntidade } from './Entidades/adminstrar-valor-significativo.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: ( configService: ConfigService ) => ({
        secret: configService.get('JWT_SEGREDO'),
        signOptions: { expiresIn: '30min'},
      }),
      inject: [ConfigService]
    }),
    rmqModule,
    LibModule,
    PerguntaModule,
    ComentarioModule,

    TypeOrmModule.forFeature([ PerguntaEntidade, ComentarioEntidade, UsuarioMetaEntidade, RespostaEntidade,AdminstracaoPrestigioEVoteForceEntidade, ComentarioEntidade, Comentario2Entidade, AdminstrarValorSignificativoEntidade]), forwardRef(() => PerguntaModule), forwardRef(() => ComentarioModule), forwardRef(() => RespostaModule), Comentario2Module, VotosModule, VotosSalvos2Module, AdminstracoesModule, AdminstrarValorSignificativoModule, 
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
