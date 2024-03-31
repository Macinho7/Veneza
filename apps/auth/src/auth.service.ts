/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException,  } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioMetaEntidade } from './Entidades/UsuarioMeta.entity';
import { Repository } from 'typeorm';
import { CriaUsuarioMEta } from './DTO/criaUsuarioMeta';
import { AtualiarUsuarioMeta } from './DTO/atualizaUsuarioMeta';
import * as bcrypt from 'bcrypt'
import { PerguntaEntidade } from './Entidades/pergunta.entity';
import { JwtService } from '@nestjs/jwt';
import { AutenticaDTO } from './DTO/AutenticaDTO';
import { verificarFraseProibida } from '../arrayF/arrayDasPalavras';

export interface payload {
  id: string,
  nome: string,
  email: string
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioMetaEntidade)
    private readonly usuarioMetarepository: Repository<UsuarioMetaEntidade>,
    @InjectRepository(PerguntaEntidade)
    private readonly perguntaRepository: Repository<PerguntaEntidade>,
    private readonly jwtService: JwtService
    
  ){}
  async descriptografarSenha(senha1: string, senha2: string){
    return await bcrypt.compare(senha1, senha2)
  }
  async acharUsuarioComMesmoNome(nome: string){
    const achado = await this.usuarioMetarepository.findOne({where: {nome}})
    if(achado){
      throw new UnauthorizedException(`Nome: ${nome} ja em uso, pense em outro!`)
    }
    return achado
  }
  async acharUsuarioComMesmoEmail(email: string){
    const achado = await this.usuarioMetarepository.findOne({where: {email}})
    if(achado){
      throw new UnauthorizedException(`Email: ${email} ja em uso, pense em outro!`)
    }
    return achado
  }
  async hashearSenha(senha: string){
    const salt =  await bcrypt.genSalt(10)
    const senhaHashead = await bcrypt.hash(senha, salt)

    return senhaHashead
  }

  async compararSenha(senhaUsuario: string, senha: string){
    return await bcrypt.compare(senhaUsuario, senha)
  }
  async criarUsuarioMeta(dados: CriaUsuarioMEta): Promise<UsuarioMetaEntidade>{

    if(dados.prestigio > 0 || dados.prestigio < 0 ){
      throw new UnauthorizedException("Prestigio sempre igual a 0")
    }
    if(dados.voteForce > 0 || dados.voteForce < 0){
      throw new UnauthorizedException("VoteForce sempre igual a 0")
    }
    await verificarFraseProibida(dados.email)
    await verificarFraseProibida(dados.senha)
    await verificarFraseProibida(dados.nome)
    const usuarioEntidade  = new  UsuarioMetaEntidade()
    usuarioEntidade.id = dados.id
    usuarioEntidade.nome = dados.nome
    usuarioEntidade.email = dados.email
    usuarioEntidade.senha = dados.senha
    usuarioEntidade.prestigio = dados.prestigio
    usuarioEntidade.voteForce = dados.voteForce
    usuarioEntidade.valorSignificativo = dados.valorSignificativo
    const senhaHashead = await this.hashearSenha(dados.senha)
    usuarioEntidade.senha = senhaHashead
    await this.acharUsuarioComMesmoEmail(dados.email)
    await this.acharUsuarioComMesmoNome(dados.nome)

    
    const usuarioCriado = await this.usuarioMetarepository.save(usuarioEntidade)
    
    return usuarioCriado
  }

  async listarUsuarios(){
    const usuarios = await this.usuarioMetarepository.find()
    for (const usuario of usuarios) {
      // Verifica se o usuário possui perguntas
      if (usuario.pergunta && usuario.pergunta.length > 0) {
          // Percorre todas as perguntas do usuário
          for (let i = usuario.pergunta.length - 1; i >= 0; i--) {
              const perguntaAchada = usuario.pergunta[i];
              // Verifica se a pergunta tem votos menores ou iguais a -5
              if (perguntaAchada.voto <= -5) {
                  // Se sim, remove a pergunta do usuário
                  //usuario.notificacoes.push(`Pergunta deletada: ${perguntaAchada.titulo}, devido a grande quantidade de votos negativos: ${perguntaAchada.voto}`)
                  await this.perguntaRepository.remove(perguntaAchada)
              }
              if (perguntaAchada.resposta && perguntaAchada.resposta.length > 0) {
                  perguntaAchada.resposta.sort((a, b) => b.voto - a.voto);
              }

          }
      }
    }
    return usuarios
  }

  async listarUsuario(id: string){
    const usuario = await this.usuarioMetarepository.findOneBy({id})
    if(usuario === null){
        throw new NotFoundException(`Usuario com id: ${id} nao achado`)
    }

    return usuario
  }

  async atualizarUsuarioMeta(usuario: AtualiarUsuarioMeta){
    const { id, nome, email, senha } = usuario
    const usuarioAchado = await this.usuarioMetarepository.findOneBy({id})
    if(usuarioAchado === null){
        throw new NotFoundException("Usuario nao achado")
    }
    await verificarFraseProibida(email)
    await verificarFraseProibida(senha)
    await verificarFraseProibida(nome)
    usuarioAchado.nome = nome
    usuarioAchado.email = email
    usuarioAchado.senha = senha
    const senhaHashead = await this.hashearSenha(senha)
    usuarioAchado.senha = senhaHashead

    const usuarioCriado = await this.usuarioMetarepository.save(usuarioAchado)

    return {
        message: 'usuario atualizado com sucesso',
        usuarioAtualizado: usuarioCriado
    }
  }

  async deletarUsuario(id: string){
    const usuarioAchado = await this.usuarioMetarepository.findOneBy({id})

    const usuarioDelete = await this.usuarioMetarepository.remove(usuarioAchado)

    return {
        message: 'usuario deletado',
        Usuario_delete: usuarioDelete
    }
  }

  async autenticaUsuarioMeta(id: string,{email, senha}: AutenticaDTO){
    const usuarioCriador = await this.usuarioMetarepository.findOneBy({id})
    if(usuarioCriador === null){
      throw new Error('Usuario nao achado')
    }
    if(usuarioCriador.email !== email){
      throw new UnauthorizedException("Voce esta usando email de outro usuario!")
    }
    try {
      // Validação de entrada
      if (!email || !senha) {
          throw new BadRequestException("Email e senha são obrigatórios.");
      }

      const usuario = await this.usuarioMetarepository.findOne({ where: { email } });
      
      if (!usuario) {
          throw new UnauthorizedException(`Usuário do email: ${email} não existe.`);
      }

      // Comparação segura de senhas usando bcrypt
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
          throw new UnauthorizedException(`Senha: ${senha} inválida.`);
      }

      // Payload do token sem a senha
      const payload: payload = {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
      };

      // Assinar token JWT
      const token = await this.jwtService.signAsync(payload);

      return {
          tokenUsuario: token
      };
    } catch (error) {
      throw new InternalServerErrorException("Ocorreu um erro ao autenticar o usuário.");
    }
  }

  async verificaJwt(jwt: string, usuarioParam: string): Promise<{ usuario: payload, exp: number}>{
    const Decode = await this.jwtService.decode(jwt)
    const idDecode = Decode.id
    const emailDecode = Decode.email
    const nomeDecode = Decode.nome
    const idUsuarioParam = Object.values(usuarioParam)[1]
    const usuarioIdDecode = await this.usuarioMetarepository.findOne({where: {id: idUsuarioParam}})


    if(String(idDecode) !== String(idUsuarioParam) && String(emailDecode) !== String(usuarioIdDecode.email)){
      throw new UnauthorizedException(`Usuario: ${usuarioIdDecode.nome} voce nao e dono desse Token, pertence ao usuario: ${nomeDecode} por favor faca o login que recebera o token automaticamente!`)
    }
    if(!jwt){
      throw new UnauthorizedException("token nao existe")
    }

    try{
      const {usuario, exp } = await this.jwtService.verifyAsync(jwt)
      return { usuario, exp}
      
    } catch(error){
      
      throw new UnauthorizedException("token invalido")
    }
  }
}
