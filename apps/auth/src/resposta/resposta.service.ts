/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RespostaEntidade } from '../Entidades/resposta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { criaRespostaDTO } from './dto/criaRespostaDTO';
import { PerguntaEntidade } from '../Entidades/pergunta.entity';
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { atualizaRespostaDTO } from './dto/atualizarRespostaDTO';
import { atualizaEspecificoRespostaDTO } from './dto/atualizaEspecificoResposta';
import { VotoSalva2Entidade } from '../Entidades/votos-salvos2.entity';
import { randomUUID } from 'crypto';
import { verificarFraseProibida } from 'apps/auth/arrayF/arrayDasPalavras';

@Injectable()
export class RespostaService {
    constructor(
        @InjectRepository(RespostaEntidade)
        private readonly respostarepository: Repository<RespostaEntidade>,
        @InjectRepository(PerguntaEntidade)
        private readonly perguntarepository: Repository<PerguntaEntidade>,
        @InjectRepository(UsuarioMetaEntidade)
        private readonly usuarioMetarepository: Repository<UsuarioMetaEntidade>,
        @InjectRepository(VotoSalva2Entidade)
        private readonly votosRespostarepository: Repository<VotoSalva2Entidade>
    ){}

    async verificarUsuarioComResposta(id: string){
        const usuario = await this.usuarioMetarepository.findOneBy({id})
            // Verifique se o usuário foi encontrado
        if (!usuario) {
             throw new NotFoundException('Usuário não encontrado');
        }   

        // Verifique se o usuário já possui uma resposta associada à pergunta
        const respostaExistente = await this.respostarepository.findOne({ where: { usuarioResposta: usuario.nome } });
        if (respostaExistente) {
            throw new BadRequestException('O usuário já postou uma resposta');
        } 

        return usuario
        
    }

    async criarResposta(idUsuario: string, idPergunta: string, dados: criaRespostaDTO): Promise<RespostaEntidade>{
        const usuario = await this.usuarioMetarepository.findOne({where: {id: idUsuario}})
        if(usuario === null){
            throw new NotFoundException("Id de usuario nao existe")
        }
        const pergunta = await this.perguntarepository.findOne({where: {id: idPergunta}})
        if(pergunta === null){
            throw new NotFoundException("Id da pergunta nao existe")
        }

        const respostaEntidade = new RespostaEntidade()

        respostaEntidade.id = dados.id
        respostaEntidade.usuarioResposta = usuario.nome
        respostaEntidade.resposta = dados.resposta
        await verificarFraseProibida(dados.resposta)

        respostaEntidade.voto = dados.voto
        respostaEntidade.pergunta = pergunta
        const usuarioProperty = Object.values(usuario)[1]
        
        await this.verificarUsuarioComResposta(idUsuario)
        if(dados.voto !== 0){
            throw new UnauthorizedException(`Voto deve ser sempre 0, ${usuarioProperty} sem autorizacao para tal! `)
        }
        

        const resposta = await this.respostarepository.save(respostaEntidade)

        return resposta
    }

    async atualizarResposta(idUsuario: string, idPergunta: string, idResposta: string,  dados: atualizaRespostaDTO){
        const usuario = await this.usuarioMetarepository.findOne({where: {id: idUsuario}})
        if(usuario === null){
            throw new NotFoundException("Id de usuario nao existe")
        }
        const pergunta = await this.perguntarepository.findOne({where: {id: idPergunta}})
        if(pergunta === null){
            throw new NotFoundException("Id da pergunta nao existe")
        }
        const resposta = await this.respostarepository.findOne({where: {id: idResposta}})
        if(resposta === null){
            throw new NotFoundException("Id da pergunta nao existe")
        }
        if(resposta.pergunta.usuario.nome !== usuario.nome){
            throw new UnauthorizedException(`Voce nao e dono dessa pergunta!`)
        }

        await verificarFraseProibida(dados.resposta)
        resposta.resposta = dados.resposta
        resposta.pergunta = pergunta
        
        const respostaAtualizada = await this.respostarepository.save(resposta)

        return respostaAtualizada
    }

    async deletaResposta(idusuarioCriador: string, idResposta: string){
        const resposta = await this.respostarepository.findOne({where: {id: idResposta}})
        if(resposta === null){
            throw new NotFoundException('resposta nao existe')
        }
        const usuarioCriador = await this.usuarioMetarepository.findOne({where: {id: idusuarioCriador}})
        if(usuarioCriador === null){
          throw new NotFoundException('resposta nao existe')
        }
        if(usuarioCriador.nome !== resposta.usuarioResposta){
          throw new UnauthorizedException(`Usuario: ${usuarioCriador.nome} nao e dono dessa resposta`)
        }

        return await this.respostarepository.remove(resposta)
    }

    async listarRespostas(){
        const respostas = await this.respostarepository.find()

        const respostasFiltradas = respostas.sort((a,b) => b.voto - a.voto)

        return respostasFiltradas
    }
    async atualizaRespostaUsuarioPrestigio(IdUsuario: string,idUsuarioPropio: string, idPergunta: string, idResposta: string, dados: atualizaEspecificoRespostaDTO){
        const usuario = await this.usuarioMetarepository.findOne({where: {id: IdUsuario}})
        if(usuario === null){
            throw new NotFoundException("Id de usuario nao existe")
        }
        const usuarioPropio = await this.usuarioMetarepository.findOne({where: {id: idUsuarioPropio}})
        if(usuarioPropio === null){
            throw new NotFoundException("Id de usuario nao existe")
        }
        const pergunta = await this.perguntarepository.findOne({where: {id: idPergunta}})
        if(pergunta === null){
            throw new NotFoundException("Id da pergunta nao existe")
        }
        const resposta = await this.respostarepository.findOne({where: {id: idResposta}})
        if(resposta === null){
            throw new NotFoundException("Id de resposta nao existe")
        }
        
        if (dados.voto > 0) {
            if (dados.voto === 1) {
              const existeVoto = await this.votosRespostarepository.findOne({
                where: {
                  idUsuario: usuario.id,
                  idPergunta: resposta.id
                }
              });
          
              // Se existe voto, lançar um erro
              if (existeVoto) {
                throw new Error("Usuário só pode fazer um voto por vez.");
              }
              // Adiciona o voto à perguntaAchada
              if(usuario.id === usuarioPropio.id){
                throw new UnauthorizedException(`Usuario: ${usuarioPropio.nome}, nao pode votar ou alterar sua propia pergunta`)
              }
              const votosEntidade = new VotoSalva2Entidade();
              votosEntidade.id = randomUUID();
              votosEntidade.idUsuario = usuario.id;
              votosEntidade.idPergunta = resposta.id;
              votosEntidade.resposta = resposta;
              if (usuario.voteForce > 30 && usuario.voteForce < 60) {
                dados.voto *= 2;
                votosEntidade.valorVoto = dados.voto
              } 
              if (usuario.voteForce > 60 && usuario.voteForce < 100) {
                 dados.voto *= 3;
                 votosEntidade.valorVoto = dados.voto
              }
              if (usuario.voteForce >= 100) {
                 dados.voto *= 4;
                 votosEntidade.valorVoto = dados.voto
              }
              resposta.voto += dados.voto
              resposta.resposta = dados.resposta
              resposta.usuarioResposta = usuario.nome
      
              await this.respostarepository.save(resposta)
              return await this.votosRespostarepository.save(votosEntidade);
          
              // Atualiza perguntaAchada no banco de dados
              
          
            }
        }
        if (dados.voto === 0) {
            console.log('voto === 0');
            const achar = await this.votosRespostarepository.findOne({ where: { idUsuario: IdUsuario, idPergunta: idResposta } });
          
            if (achar !== null) {
              // Remove o voto
              console.log(achar.valorVoto)
              if(usuario.id === usuarioPropio.id){
                throw new UnauthorizedException(`Usuario: ${usuarioPropio.nome}, nao pode votar ou alterar sua propia pergunta`)
              }
              // Subtrai o voto de perguntaAchada
              resposta.voto -= achar.valorVoto;
              
              // Atualiza perguntaAchada no banco de dados
              await this.respostarepository.save(resposta);
              await this.votosRespostarepository.remove(achar);
        
            } else {
              return dados.voto = 0;
            }
        }
        if (dados.voto < 0) {
            if (dados.voto === -1) {
              const existeVoto = await this.votosRespostarepository.findOne({
                where: {
                  idUsuario: usuario.id,
                  idPergunta: resposta.id
                }
              });
          
              // Se existe voto, lançar um erro
              if (existeVoto) {
                throw new Error("Usuário só pode fazer um voto por vez.");
              }
          
              // Adiciona o voto à perguntaAchada
              if(usuario.id === usuarioPropio.id){
                throw new UnauthorizedException(`Usuario: ${usuarioPropio.nome}, nao pode votar ou alterar sua propia pergunta`)
              }
              const votosEntidade = new VotoSalva2Entidade();
              votosEntidade.id = randomUUID();
              votosEntidade.idUsuario = usuario.id;
              votosEntidade.idPergunta = resposta.id;
              votosEntidade.resposta = resposta;
              if (usuario.voteForce > 30 && usuario.voteForce < 60) {
                dados.voto *= 2;
                votosEntidade.valorVoto = dados.voto
              } 
              if (usuario.voteForce > 60 && usuario.voteForce < 100) {
                 dados.voto *= 3;
                 votosEntidade.valorVoto = dados.voto
              }
              if (usuario.voteForce >= 100) {
                 dados.voto *= 4;
                 votosEntidade.valorVoto = dados.voto
              }
              resposta.voto += dados.voto
          
              
              await this.respostarepository.save(resposta)
              return await this.votosRespostarepository.save(votosEntidade);
          
            } 
        }
      

        const respostaAtualizadaComEfeitos = await this.respostarepository.save(resposta)
        return respostaAtualizadaComEfeitos
            
        }
    

    async listarResposta( id: string){
        const respostaAchada = await this.respostarepository.findOneBy({id})
        if(respostaAchada === null){
            throw new NotFoundException('Resposta nao achada')
        }

        return respostaAchada
    }
}
