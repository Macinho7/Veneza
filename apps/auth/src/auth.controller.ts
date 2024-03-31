/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CriaUsuarioMEta } from './DTO/criaUsuarioMeta';
import { AtualiarUsuarioMeta } from './DTO/atualizaUsuarioMeta';
import { AutenticaDTO } from './DTO/AutenticaDTO';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'get-usuarios'})
  async listarUsuarios(@Ctx() contexto: RmqContext){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.authService.listarUsuarios()
  }
  @MessagePattern({ cmd: 'get-usuario'})
  async listarUsuario(@Ctx() contexto: RmqContext, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.authService.listarUsuario(id)
  }
  @MessagePattern({ cmd: 'post-usuario'})
  async enviarUsuario(@Ctx() contexto: RmqContext, @Payload() usuario: CriaUsuarioMEta){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.authService.criarUsuarioMeta(usuario)
  }
  @MessagePattern({ cmd: 'patch-usuario'})
  async atualizarUsuario(@Ctx() contexto: RmqContext, @Payload() usuario: AtualiarUsuarioMeta){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.authService.atualizarUsuarioMeta(usuario)
  }
  @MessagePattern({ cmd: 'del-usuario'})
  async deletarUsuario(@Ctx() contexto: RmqContext, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.authService.deletarUsuario(id)
  }
  @MessagePattern({ cmd: 'login'})
  async autenticaUsuario(@Ctx() contexto: RmqContext,@Payload() payload: { id: string; dados: AutenticaDTO;  }){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.authService.autenticaUsuarioMeta(payload.id, payload.dados)
  }
  @MessagePattern({ cmd: 'verificar-token'})
  async verificandoJwtPayload(@Ctx() contexto: RmqContext, @Payload() payload: { jwt: string}, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.authService.verificaJwt(payload.jwt, id)
  }
}
