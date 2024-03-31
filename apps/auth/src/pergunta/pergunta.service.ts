/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerguntaEntidade } from '../Entidades/pergunta.entity';
import { Repository } from 'typeorm';
import { criarPerguntaDTO } from './dto/criaPerguntaDTO';
import { AtualizarPergunta } from './dto/atualizarPerguntaDTO';
import { UsuarioMetaEntidade } from '../Entidades/UsuarioMeta.entity';
import { randomUUID } from 'crypto';
import { VotoSalvaEntidade } from '../Entidades/voto.entity';
import { AdminstracaoPrestigioEVoteForceEntidade } from '../Entidades/adminstracoe.entity';
import { AdminstrarValorSignificativoEntidade } from '../Entidades/adminstrar-valor-significativo.entity';
import { verificarFraseProibida } from 'apps/auth/arrayF/arrayDasPalavras';

export interface payload {
  idUser: string
  idPergunta: string
}
@Injectable()
export class PerguntaService {
  constructor(
    @InjectRepository(PerguntaEntidade)
    private readonly perguntaRepository: Repository<PerguntaEntidade>,
    @InjectRepository(UsuarioMetaEntidade)
    private readonly usuarioMetaRepository: Repository<UsuarioMetaEntidade>,
    @InjectRepository(VotoSalvaEntidade)
    private readonly votosSalvaRepository: Repository<VotoSalvaEntidade>,
    @InjectRepository(AdminstracaoPrestigioEVoteForceEntidade)
    private readonly admVoteForcePrestigioRepository: Repository<AdminstracaoPrestigioEVoteForceEntidade>,
    @InjectRepository(AdminstrarValorSignificativoEntidade)
    private readonly admValorSignificativoRepository: Repository<AdminstrarValorSignificativoEntidade>
  ){}
    

  async criarPergunta(dados: criarPerguntaDTO): Promise<PerguntaEntidade>{
    const { id, titulo, pergunta, voto} = dados
    const usuario = await this.usuarioMetaRepository.findOneBy({id})

    if(usuario === null){
      throw new NotFoundException('Usuario nao existe')
    }
    await verificarFraseProibida(pergunta)
    const perguntaEntidade = new PerguntaEntidade()

    perguntaEntidade.id = id
    perguntaEntidade.titulo = titulo
    perguntaEntidade.pergunta = pergunta
    perguntaEntidade.voto = voto
    perguntaEntidade.usuario = usuario
    const id2 = randomUUID()
    perguntaEntidade.id = id2
    if(usuario.valorSignificativo <= -10){
      throw  new UnauthorizedException(`Usuario: ${usuario.nome}, voce possui um historico de perguntas mal feitas, por favor edite suas anterioes para que usuarios possam votar com votos positivos para sua pergunta!`)
    }
    
    const perguntaCriada = await this.perguntaRepository.save(perguntaEntidade)

    return perguntaCriada
  }

  async atualizarPergunta(dados: AtualizarPergunta){
    const { id, titulo, pergunta } = dados

    const perguntaAchado = await this.perguntaRepository.findOneBy({id})
    if(perguntaAchado === null){
      throw new NotFoundException('pergunta nao achada')
    }
    await verificarFraseProibida(pergunta)
    const perguntaAtualizada = await this.perguntaRepository.save({ titulo, pergunta})
    
    return {
      message: 'Perguntada Editada',
      Pergunta: perguntaAtualizada
    }
  }
  async usuarioPrestigiadoAtualiza(idUsuario: string, idUsuarioPropio: string, idPergunta: string,   dados: AtualizarPergunta) {
    
    
    const usuario = await this.usuarioMetaRepository.findOne({where: {id: idUsuario}})
    if(usuario === null){
      throw new NotFoundException('Usuario Prestigiado nao existe')
    }
    const usuario2 = await this.usuarioMetaRepository.findOne({where: {id: idUsuarioPropio}})
    if(usuario2 === null){
      throw new NotFoundException('Usuario Propio nao existe')
    }
    const perguntaAchada = await this.perguntaRepository.findOne({where: {id: idPergunta}})
    if(perguntaAchada === null){
      throw new NotFoundException('Pergunta nao existe')
    }
    let perguntaEncontrada = false;
    for(let i = 0; i < usuario2.pergunta.length; i++){
      if(usuario2.pergunta[i].id === perguntaAchada.id){
        perguntaEncontrada = true;
        break; // Sair do loop assim que encontrar a pergunta
      }
    }
    if (!perguntaEncontrada) {
      throw new UnauthorizedException(`Usuario: ${usuario2.nome} nao possui essa pergunta`)
    }

    
    perguntaAchada.titulo = dados.titulo
    perguntaAchada.pergunta = dados.pergunta
    perguntaAchada.usuario = usuario2
    
    if (!perguntaAchada.id) {
      throw new Error("A pergunta encontrada não possui um identificador.");
    }
    if(usuario.prestigio < 20){
      throw new UnauthorizedException(`Usuario: ${usuario.nome} nao possui prestigio suficiente!`)
    }
    
    if (dados.voto > 0) {
      if (dados.voto === 1) {
        const existeVoto = await this.votosSalvaRepository.findOne({
          where: {
            idUsuario: usuario.id,
            idPergunta: perguntaAchada.id
          }
        });
    
        // Se existe voto, lançar um erro
        if (existeVoto) {
          throw new Error("Usuário só pode fazer um voto por vez.");
        }
        // Adiciona o voto à perguntaAchada
        if(usuario.id === usuario2.id){
          throw new UnauthorizedException(`Usuario: ${usuario2.nome}, nao pode votar ou alterar sua propia pergunta`)
        }
        
        const votosEntidade = new VotoSalvaEntidade();
        votosEntidade.id = randomUUID();
        votosEntidade.idUsuario = usuario.id;
        votosEntidade.idPergunta = perguntaAchada.id;
        votosEntidade.pergunta = perguntaAchada;
        if (usuario.voteForce >= 0 && usuario.voteForce < 30) {
          dados.voto *= 1;
          votosEntidade.valorVoto = dados.voto
        } 
        if (usuario.voteForce >= 30 && usuario.voteForce < 60) {
          dados.voto *= 2;
          votosEntidade.valorVoto = dados.voto
        } 
        if (usuario.voteForce >= 60 && usuario.voteForce < 100) {
           dados.voto *= 3;
           votosEntidade.valorVoto = dados.voto
        }
        if (usuario.voteForce >= 100) {
           dados.voto *= 4;
           votosEntidade.valorVoto = dados.voto
        }
     
        perguntaAchada.voto += dados.voto

        let admEntidade
        const soma = perguntaAchada.voto + dados.voto
        if(perguntaAchada.voto > 0 && soma > 0){
          usuario2.prestigio += 4;
          usuario2.voteForce += 1;
          admEntidade = new AdminstracaoPrestigioEVoteForceEntidade()
          admEntidade.id = randomUUID()
          admEntidade.idUsuarioPrestigiado = usuario.id
          admEntidade.idPergunta = perguntaAchada.id
          admEntidade.valorPrestigio = 4
          admEntidade.valorVoteForce = 1
          admEntidade.pergunta = perguntaAchada
        } else {
          console.log('dando um teste')
        }
        if(usuario2.prestigio >= 100000){
          usuario2.prestigio = 100000
        }
        if(usuario2.voteForce >= 100){
          usuario2.voteForce = 100
        }
        if(usuario2.voteForce < 0){
          usuario2.voteForce = 0
        }
        if(usuario2.prestigio < 0){
           usuario2.prestigio = 0
        }
        return await Promise.all([,
          this.usuarioMetaRepository.save(usuario2),
          this.perguntaRepository.save(perguntaAchada),
          this.votosSalvaRepository.save(votosEntidade),
          admEntidade ? this.admVoteForcePrestigioRepository.save(admEntidade) : Promise.resolve()
        ]);
      
      }
    }
    if (dados.voto === 0) {
      console.log('voto === 0');
      const achar = await this.votosSalvaRepository.findOne({ where: { idUsuario: idUsuario, idPergunta: idPergunta } });
      const admAchar = await this.admVoteForcePrestigioRepository.findOne({where: {idUsuarioPrestigiado: idUsuario, idPergunta: idPergunta}})
      const valorHR = await this.admValorSignificativoRepository.findOne({where: {idUsuarioPrestigiado: idUsuario, idPergunta: idPergunta}})
      if (achar !== null) {
        if(usuario.id === usuario2.id){
          throw new UnauthorizedException(`Usuario: ${usuario2.nome}, nao pode votar ou alterar sua propia pergunta`)
        }
        // Subtrai o voto de perguntaAchada
        perguntaAchada.voto -= achar.valorVoto;
        
        // Atualiza perguntaAchada no banco de dados
        await this.perguntaRepository.save(perguntaAchada);
        await this.votosSalvaRepository.remove(achar);
  
      }
      if(admAchar !== null){
        const prestigioAdm = admAchar.valorPrestigio
        const voterForceAdm = admAchar.valorVoteForce
        const usuario = usuario2

        if(admAchar.valorPrestigio < 0 && admAchar.valorVoteForce < 0){    
          const voteForcePositivo = voterForceAdm * -1
          const prestigioPositivo = prestigioAdm * -1
          console.log(admAchar.valorPrestigio)
          console.log(admAchar.valorVoteForce)
          
          usuario.prestigio += prestigioPositivo 
          usuario.voteForce += voteForcePositivo
          
          console.log(prestigioPositivo)
          console.log(voteForcePositivo)
          
        } else if(admAchar.valorPrestigio > 0 && admAchar.valorVoteForce > 0){
          if(perguntaAchada.voto > 0 || perguntaAchada.voto === 0){
            usuario.prestigio -= prestigioAdm 
            usuario.voteForce -= voterForceAdm
          }
          
        }

        await this.usuarioMetaRepository.save(usuario)
        await this.admVoteForcePrestigioRepository.remove(admAchar)
      } 
      
      if(valorHR !== null){
        if(usuario2.valorSignificativo === 0){
          console.log('entrou aqui')
          usuario2.valorSignificativo = 0
        } else if(usuario2.valorSignificativo < 0) {
          console.log('entrou aqui 2')
          usuario2.valorSignificativo -= valorHR.valorSignificativoHR
          await this.admValorSignificativoRepository.remove(valorHR)
        }
        
      } else {
        console.log('nao existe')
      }
      
    }
    if (dados.voto < 0) {
      if (dados.voto === -1) {
        const existeVoto = await this.votosSalvaRepository.findOne({
          where: {
            idUsuario: usuario.id,
            idPergunta: perguntaAchada.id
          }
        });

        
        // Se existe voto, lançar um erro
        if (existeVoto) {
          throw new Error("Usuário só pode fazer um voto por vez.");
        }
    
        
        if(usuario.id === usuario2.id){
          throw new UnauthorizedException(`Usuario: ${usuario2.nome}, nao pode votar ou alterar sua propia pergunta`)
        }
        
                  
        console.log(dados.voto)
        const admValorSignificativo = new AdminstrarValorSignificativoEntidade()
        admValorSignificativo.id = randomUUID()
        admValorSignificativo.idUsuarioPrestigiado = usuario.id
        admValorSignificativo.idPergunta = perguntaAchada.id
        admValorSignificativo.valorSignificativoHR = dados.voto
        admValorSignificativo.usuario = usuario2
        
 
        let admEntidade
        
        if(perguntaAchada.voto < 0){
          usuario2.prestigio -= 4;
          usuario2.voteForce -= 1;
          admEntidade = new AdminstracaoPrestigioEVoteForceEntidade()
          admEntidade.id = randomUUID()
          admEntidade.idUsuarioPrestigiado = usuario.id
          admEntidade.idPergunta = perguntaAchada.id
          admEntidade.valorPrestigio = -4
          admEntidade.valorVoteForce = -1
          admEntidade.pergunta = perguntaAchada
        } 

        const votosEntidade = new VotoSalvaEntidade();
        votosEntidade.id = randomUUID();
        votosEntidade.idUsuario = usuario.id;
        votosEntidade.idPergunta = perguntaAchada.id;
        votosEntidade.pergunta = perguntaAchada;
        if (usuario.voteForce >= 0 && usuario.voteForce < 30) {
          dados.voto *= 1;
          votosEntidade.valorVoto = dados.voto
        } 
        if (usuario.voteForce >= 30 && usuario.voteForce < 60) {
          dados.voto *= 2;
          votosEntidade.valorVoto = dados.voto
        } 
        if (usuario.voteForce >= 60 && usuario.voteForce < 100) {
           dados.voto *= 3;
           votosEntidade.valorVoto = dados.voto
        }
        if (usuario.voteForce >= 100) {
           dados.voto *= 4;
           votosEntidade.valorVoto = dados.voto
        }
        perguntaAchada.voto += dados.voto
        const votosSoma = perguntaAchada.voto + dados.voto
        if(perguntaAchada.voto === 0){
          console.log('')
         
        } else if(votosSoma < 0) {
          console.log('Entrou aqui no primeiro if camarada');
          const dadosVotoDefinido = -1
          usuario2.valorSignificativo += dadosVotoDefinido;
        } else if(perguntaAchada.voto < 0){
          console.log('Entrou aqui no segundo if camarada');
          const dadosVotoDefinido = -1
          usuario2.valorSignificativo += dadosVotoDefinido;
        }
        if(perguntaAchada.voto === 0){
          console.log("caiu aqui tambem jow")
        } else if( votosSoma < 0){
          console.log('Entrou nesse if')
          const admValorSignificativo = new AdminstrarValorSignificativoEntidade()
          admValorSignificativo.id = randomUUID()
          admValorSignificativo.idUsuarioPrestigiado = usuario.id
          admValorSignificativo.idPergunta = perguntaAchada.id
          admValorSignificativo.valorSignificativoHR = dados.voto
          admValorSignificativo.usuario = usuario2
        }
        if(usuario2.prestigio >= 100000){
          usuario2.prestigio = 100000
        }
        if(usuario2.voteForce >= 100){
          usuario2.voteForce = 100
        }
        if(usuario2.voteForce < 0){
          usuario2.voteForce = 0
        }
        if(usuario2.prestigio < 0){
           usuario2.prestigio = 0
        }
        return await Promise.all([
          this.usuarioMetaRepository.save(usuario2),
          this.perguntaRepository.save(perguntaAchada),
          this.votosSalvaRepository.save(votosEntidade),
          admEntidade ? this.admVoteForcePrestigioRepository.save(admEntidade) : Promise.resolve(),
          this.admValorSignificativoRepository.save(admValorSignificativo)
        ])
    
      }
    }

    const perguntaMudadaPorPrestigiado = await this.perguntaRepository.save(perguntaAchada)
    
    return perguntaMudadaPorPrestigiado

  }

  async listarPergunta(id: string){
    const pergunta = await this.perguntaRepository.findOneBy({id})
    if(pergunta === null){
      throw new NotFoundException('Pergunta nao achada')
    }
    if(pergunta.voto <= -5){
      await this.perguntaRepository.remove(pergunta)
    }

    return pergunta
  }

  async listarPerguntas(){
    const perguntas = await this.perguntaRepository.find()
    
    
    // Percorre todas as perguntas para verificar os votos
    for (const pergunta of perguntas) {
      
      // Verifica se a pergunta tem votos menores ou iguais a -5
      if (pergunta.voto <= -5) {
          // Se sim, remove a pergunta usando o repositório
          await this.perguntaRepository.remove(pergunta);
      }
    }

    return perguntas
  }

  async deletarPergunta(idUsuarioQueCriou: string, idPergunta: string){
    const deletado = await this.perguntaRepository.findOne({where: {id: idPergunta}})
    const usuarioCriou = await this.usuarioMetaRepository.findOne({where: {id: idUsuarioQueCriou}})
    if(deletado === null){
      throw new NotFoundException('Pergunta nao encontrada')
    }
    if(usuarioCriou === null){
      throw new NotFoundException('Pergunta nao encontrada')
    }
    let perguntaAchada = false 
    for(let i = 0; i < usuarioCriou.pergunta.length; i++){
      const perguntaId = usuarioCriou.pergunta[i]
      if(perguntaId.id === deletado.id){
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        perguntaAchada = true
        break
      } 
    }
    if(!perguntaAchada){
      throw new UnauthorizedException("Usuario nao possui essa pergunta")
    } else {
      return await this.perguntaRepository.remove(deletado)
    }
  }
}
