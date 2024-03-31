/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { RespostaService } from './resposta.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { criaRespostaDTO } from './dto/criaRespostaDTO';
import { atualizaRespostaDTO } from './dto/atualizarRespostaDTO';
import { atualizaEspecificoRespostaDTO } from './dto/atualizaEspecificoResposta';

@Controller()
export class RespostaController {
  constructor(private readonly respostaService: RespostaService) {}


  @MessagePattern({ cmd: 'post-resposta'})
  async enviarResposta(@Ctx() contexto: RmqContext, @Payload() payload: { idUsuario: string; idPergunta: string;  dados: criaRespostaDTO }){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.respostaService.criarResposta(payload.idUsuario, payload.idPergunta, payload.dados)
  }
  @MessagePattern({ cmd: 'put-respostaAtualiza'})
  async atualizarResposta(@Ctx() contexto: RmqContext,@Payload() payload: { idUsuario: string;  idPergunta: string;  idResposta: string;  dados: atualizaRespostaDTO}){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.respostaService.atualizarResposta(payload.idUsuario, payload.idPergunta, payload.idResposta, payload.dados)
  }
  @MessagePattern({ cmd: 'put- respostaAtualizaComPrestigio'})
  async atualizarRespostaComPrestigio(@Ctx() contexto: RmqContext, @Payload() payload: { idUsuario: string; idUsuarioPropio: string; idPergunta: string;idResposta: string;  dados: atualizaEspecificoRespostaDTO }){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.respostaService.atualizaRespostaUsuarioPrestigio(payload.idUsuario, payload.idUsuarioPropio, payload.idPergunta ,payload.idResposta , payload.dados)
  }
  @MessagePattern({ cmd: 'del-resposta'})
  async deletaResposta(@Ctx() contexto: RmqContext, @Payload() payload: {idusuarioCriador: string;  idResposta: string   }){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.respostaService.deletaResposta(payload.idusuarioCriador, payload.idResposta)
  }
  @MessagePattern({ cmd: 'get-respostas'})
  async listarRespostas(@Ctx() contexto: RmqContext){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.respostaService.listarRespostas()
  }
  @MessagePattern({ cmd: 'get-resposta'})
  async listarResposta(@Ctx() contexto: RmqContext, @Payload() id: string ){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.respostaService.listarResposta(id)
  }
}
