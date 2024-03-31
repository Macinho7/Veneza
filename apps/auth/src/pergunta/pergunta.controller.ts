/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { PerguntaService } from './pergunta.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { criarPerguntaDTO } from './dto/criaPerguntaDTO';
import { AtualizarPergunta } from './dto/atualizarPerguntaDTO';

@Controller()
export class PerguntaController {
  constructor(private readonly perguntaService: PerguntaService) {}

  @MessagePattern({ cmd: 'get-perguntas'})
  async listarUsuarios(@Ctx() contexto: RmqContext){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.perguntaService.listarPerguntas()
  }
  @MessagePattern({ cmd: 'get-pergunta'})
  async listarUsuario(@Ctx() contexto: RmqContext, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.perguntaService.listarPergunta(id)
  }
  @MessagePattern({ cmd: 'post-pergunta'})
  async enviarPerguntas(@Ctx() contexto: RmqContext,@ Payload() dados: criarPerguntaDTO){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.perguntaService.criarPergunta(dados)
  }
  @MessagePattern({ cmd: 'put-perguntaPrestigio'})
  async enviarPerguntaAvaliada(@Ctx() contexto: RmqContext, @Payload() payload: { idUsuario: string; idUsuarioPropio: string; idPergunta: string; dados: AtualizarPergunta }){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.perguntaService.usuarioPrestigiadoAtualiza(payload.idUsuario, payload.idUsuarioPropio, payload.idPergunta, payload.dados )
  }
  @MessagePattern({ cmd: 'put-pergunta'})
  async atualizarPergunta(@Ctx() contexto: RmqContext, @Payload() dados: AtualizarPergunta ){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.perguntaService.atualizarPergunta(dados)
  }

  @MessagePattern({ cmd: 'del-pergunta'})
  async deletaUsuario(@Ctx() contexto: RmqContext, @Payload() payload: {idUsuarioQueCriou: string; idPergunta: string;}){
    const channel = contexto.getChannelRef() 
    const message = contexto.getMessage()
    channel.ack(message)

    return this.perguntaService.deletarPergunta(payload.idUsuarioQueCriou, payload.idPergunta)
  }
}
