/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComentarioEntidade } from '../Entidades/comentario.entity';
import { Repository } from 'typeorm';
import { criarComentarioDTO } from './dto/criaComentarioDTO';
import { PerguntaEntidade } from '../Entidades/pergunta.entity';
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { randomUUID } from 'crypto';
import { AtualizaComentarioDTO } from './dto/atualizarComentarioDTO';
import { verificarFraseProibida } from 'apps/auth/arrayF/arrayDasPalavras';


@Injectable()
export class ComentarioService {
 constructor(
    @InjectRepository(ComentarioEntidade)
    private readonly comentarioRepositoy: Repository<ComentarioEntidade>,
    @InjectRepository(PerguntaEntidade)
    private readonly perguntaRepositoy: Repository<PerguntaEntidade>,
    @InjectRepository(UsuarioMetaEntidade)
    private readonly usuarioRepositoy: Repository<UsuarioMetaEntidade>
 ){}

    async criarComentario(idUsuarioPropio: string, idPergunta: string, dados: criarComentarioDTO): Promise<ComentarioEntidade>{ 
        
        const perguntaAchada = await this.perguntaRepositoy.findOne({where: {id: idPergunta}})
        const usuario = await this.usuarioRepositoy.findOne({where: {id: idUsuarioPropio}})
        console.log(usuario)
        console.log(perguntaAchada)
        if(perguntaAchada === null){
            throw new NotFoundException('Pergunta nao achada')
        }
        if(usuario === null){
            throw new NotFoundException('Usuario nao achado')
        }
        await verificarFraseProibida(dados.comentario)
        const comentarioEntidade = new ComentarioEntidade()
        comentarioEntidade.id = dados.id
        comentarioEntidade.nomeUsuario = usuario.nome
        comentarioEntidade.comentario = dados.comentario
        comentarioEntidade.pergunta = perguntaAchada
        const id2 = randomUUID()
        comentarioEntidade.id = id2

        const comentarioCriado = await this.comentarioRepositoy.save(comentarioEntidade)

        return comentarioCriado

    }

    async listarComentarios(){
        const comentarios = await this.comentarioRepositoy.find()

        return comentarios
    }

    async listarComentario( id: string){
        const comentario = await this.comentarioRepositoy.findOneBy({id})
        if(comentario === null){
            throw new UnauthorizedException('Comentario nao achado')
        }
        
        return comentario
    }

    async atualizarComentario(usuarioQueCriou: string, idPergunta: string,  id: string, dados: AtualizaComentarioDTO){
        const comentario = await this.comentarioRepositoy.findOneBy({id})
        if(comentario === null){
            throw new NotFoundException("Comentario nao existe")
        }

        const usuarioAchado = await this.usuarioRepositoy.findOne({where: {id: usuarioQueCriou}})
        if(usuarioAchado === null){
            throw new NotFoundException("Usuario nao existe")
        }
        const perguntaComentario = await this.perguntaRepositoy.findOne({where: {id: idPergunta}})
        if(perguntaComentario === null){
            throw new NotFoundException("Pergunta nao existe")
        }

        if(usuarioAchado.nome !== comentario.nomeUsuario){
            console.log(usuarioAchado.nome)
            console.log(comentario.nomeUsuario)
            throw new UnauthorizedException(`Usuario: ${usuarioAchado.nome} nao e dono do comentario: ${comentario.comentario}`)
        }

        await verificarFraseProibida(dados.comentario)
        comentario.comentario = dados.comentario
        comentario.pergunta = perguntaComentario


        const salvar = await this.comentarioRepositoy.save(comentario)

        return salvar
    }

    async deletarComentario(usuarioCriador: string, idComentario: string){
        const comentario = await this.comentarioRepositoy.findOne({where: {id: idComentario}})
        if(comentario === null){
            throw new NotFoundException("Comentario nao existe")
        }
        const usuarioC = await this.usuarioRepositoy.findOne({where: {id: usuarioCriador}})
        if(usuarioC === null){
            throw new NotFoundException("Usuario nao existe")
        }
        if(usuarioC.nome !== comentario.nomeUsuario){
            throw new UnauthorizedException(`Usuario: ${usuarioC.nome} nao e dono do comentario: ${comentario.comentario}`)
        }

        const Del = await this.comentarioRepositoy.remove(comentario)

        return Del
    }
}
