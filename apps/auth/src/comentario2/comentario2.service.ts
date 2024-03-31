/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RespostaEntidade } from '../Entidades/resposta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { Comentario2Entidade } from '../Entidades/comentario2.entity';
import { criarComentarioRespostaDTO } from './dto/criarComentario2DTO';
import { atualizarComentarioRespostaDTO } from './dto/atualizarComentario2DTO.ts';
import { verificarFraseProibida } from 'apps/auth/arrayF/arrayDasPalavras';


@Injectable()
export class Comentario2Service {
    constructor(
        @InjectRepository(RespostaEntidade)
        private readonly respostaRepositoy: Repository<RespostaEntidade>,
        @InjectRepository(UsuarioMetaEntidade)
        private readonly usuarioRepositoy: Repository<UsuarioMetaEntidade>,
        @InjectRepository(Comentario2Entidade)
        private readonly comentario2Repository: Repository<Comentario2Entidade>
     ){}

    async criarComentarioResposta(idUsuario: string, idResposta: string, dados: criarComentarioRespostaDTO): Promise<Comentario2Entidade>{
        const usuario = await this.usuarioRepositoy.findOne({where: {id: idUsuario}})
        if(usuario === null){
            throw new NotFoundException('Id Usuario nao achado')
        }
        const resposta = await this.respostaRepositoy.findOne({where: {id: idResposta}})
        if(resposta === null){
            throw new NotFoundException('Id Resposta nao chado')
        }
        const comentario2Entidade = new Comentario2Entidade()

        comentario2Entidade.id = dados.id
        comentario2Entidade.nomeUsuario = usuario.nome
        comentario2Entidade.comentario = dados.comentario
        await verificarFraseProibida(dados.comentario)
        comentario2Entidade.resposta = resposta

        const comentarioDaResposta = await this.comentario2Repository.save(comentario2Entidade)
        return comentarioDaResposta
    }

    async atualizarComentarioDaResposta(idUsuario: string, idResposta: string, idComentario2: string, dados: atualizarComentarioRespostaDTO){
        const usuario = await this.usuarioRepositoy.findOne({where: {id: idUsuario}})
        if(usuario === null){
            throw new NotFoundException('Id Usuario nao achado')
        }

        const resposta = await this.respostaRepositoy.findOne({where: {id: idResposta}})
        if(resposta === null){
            throw new NotFoundException('Id Resposta nao chado')
        }

        const comentario = await this.comentario2Repository.findOne({where: {id: idComentario2}})
        if(comentario === null){
            throw new NotFoundException('Id Comentario nao chado')
        }

        if(comentario.nomeUsuario !== usuario.nome){
            console.log(comentario.nomeUsuario)
            console.log(usuario.nome)
            throw new UnauthorizedException('Teste Comentario nao e dono')
        }

        comentario.comentario = dados.comentario
        comentario.resposta = resposta
        await verificarFraseProibida(dados.comentario)

        const comentarioAtualizado = await this.comentario2Repository.save(comentario)

        return comentarioAtualizado
    }

    async deletaComentario(idUsuarioCriador: string, idComentario: string){
        const comentario = await this.comentario2Repository.findOne({where: {id: idComentario}})
        if(comentario === null){
            throw new NotFoundException('comentario nao existe')
        }
        const usuarioCriador = await this.usuarioRepositoy.findOne({where: {id: idUsuarioCriador}})
        if(usuarioCriador === null){
            throw new NotFoundException('comentario nao existe')
        }
        if(usuarioCriador.nome !== comentario.nomeUsuario){
            throw new UnauthorizedException(`Usuario: ${usuarioCriador.nome} nao e dono desse comentario`)
        }
        return await this.comentario2Repository.remove(comentario)
    }

    async listarComentarioDasRespostas(){
        const comentarios = await this.comentario2Repository.find()

        return comentarios
    }

    async listarComentarioResposta(id: string){
        const comentario = await this.comentario2Repository.findOneBy({id})
        if(comentario === null){
            throw new NotFoundException('comentario nao existe')
        }
        
        return  comentario
    }

}
