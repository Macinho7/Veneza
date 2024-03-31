/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { criarComentarioDTO } from './dto/criaComentarioDTO';
import { AtualizaComentarioDTO } from './dto/atualizarComentarioDTO';

@Controller()
export class ComentarioController {
  constructor(private readonly comentarioService: ComentarioService) {}

  @MessagePattern({ cmd: 'post-comentarioPr'})
  async comentarioPropio(@Ctx() contexto: RmqContext,@Payload() payload: { idUsuarioPropio: string; idPergunta: string;  dados: criarComentarioDTO }){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.comentarioService.criarComentario(payload.idUsuarioPropio,  payload.idPergunta, payload.dados)
  }

  @MessagePattern({ cmd: 'put-comentarioAtualiaza'})
  async atualizaComentario(@Ctx() contexto: RmqContext, @Payload() payload: { usuarioQueCriou: string; idPergunta: string; id: string;  dados: AtualizaComentarioDTO }){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.comentarioService.atualizarComentario(payload.usuarioQueCriou, payload.idPergunta, payload.id, payload.dados)
  }
  @MessagePattern({ cmd: 'del-comentarioDeleta'})
  async deletaComentario(@Ctx() contexto: RmqContext,@Payload() payload: { usuarioCriador: string; id: string}){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.comentarioService.deletarComentario(payload.usuarioCriador, payload.id)
  }
  @MessagePattern({ cmd: 'get-listaComentarios'})
  async listarComentarios(@Ctx() contexto: RmqContext){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.comentarioService.listarComentarios()
  }
  @MessagePattern({ cmd: 'get-listaComentario'})
  async listarComentario(@Ctx() contexto: RmqContext, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.comentarioService.listarComentario(id)
  }


}
