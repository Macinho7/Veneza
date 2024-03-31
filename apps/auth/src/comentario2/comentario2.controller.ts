/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { Comentario2Service } from './comentario2.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { criarComentarioRespostaDTO } from './dto/criarComentario2DTO';
import { atualizarComentarioRespostaDTO } from './dto/atualizarComentario2DTO.ts';


@Controller()
export class Comentario2Controller {
  constructor(private readonly comentario2Service: Comentario2Service) {}

  @MessagePattern({ cmd: 'post-Comentario2Resposta'})
  async comentarioCriar(@Ctx() contexto: RmqContext, @Payload() payload: { idUsuario: string; idResposta: string;  dados: criarComentarioRespostaDTO }){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.comentario2Service.criarComentarioResposta(payload.idUsuario, payload.idResposta,  payload.dados)
  }

  @MessagePattern({ cmd: 'put-comentario2Atualiaza'})
  async atualizaComentario(@Ctx() contexto: RmqContext, @Payload() payload: { usuarioQueCriou: string; idResposta: string; idComentario2: string;  dados: atualizarComentarioRespostaDTO }){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.comentario2Service.atualizarComentarioDaResposta(payload.usuarioQueCriou, payload.idResposta, payload.idComentario2, payload.dados)
  }

  @MessagePattern({ cmd: 'del-comentario2Deleta'})
  async deletaComentario(@Ctx() contexto: RmqContext,@Payload() payload: {idUsuarioCriador: string, idComentario: string}){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.comentario2Service.deletaComentario(payload.idUsuarioCriador, payload.idComentario)
  }

  @MessagePattern({ cmd: 'get-lista2Comentarios'})
  async listarComentarios(@Ctx() contexto: RmqContext){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.comentario2Service.listarComentarioDasRespostas()
  }
  @MessagePattern({ cmd: 'get-lista2Comentario'})
  async listarComentario(@Ctx() contexto: RmqContext, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.comentario2Service.listarComentarioResposta(id)
  }
}
