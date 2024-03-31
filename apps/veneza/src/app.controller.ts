/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AutenticaDTO } from 'apps/auth/src/DTO/AutenticaDTO';
import { AtualiarUsuarioMeta } from 'apps/auth/src/DTO/atualizaUsuarioMeta';
import { CriaUsuarioMEta } from 'apps/auth/src/DTO/criaUsuarioMeta';
import { AuthGuarda } from 'apps/auth/src/Jwt/token/token.guard';
import { AtualizaComentarioDTO } from 'apps/auth/src/comentario/dto/atualizarComentarioDTO';
import { criarComentarioDTO } from 'apps/auth/src/comentario/dto/criaComentarioDTO';
import { atualizarComentarioRespostaDTO } from 'apps/auth/src/comentario2/dto/atualizarComentario2DTO.ts';
import { criarComentarioRespostaDTO } from 'apps/auth/src/comentario2/dto/criarComentario2DTO';
import { AtualizarPergunta } from 'apps/auth/src/pergunta/dto/atualizarPerguntaDTO';
import { criarPerguntaDTO } from 'apps/auth/src/pergunta/dto/criaPerguntaDTO';
import { atualizaEspecificoRespostaDTO } from 'apps/auth/src/resposta/dto/atualizaEspecificoResposta';
import { atualizaRespostaDTO } from 'apps/auth/src/resposta/dto/atualizarRespostaDTO';
import { criaRespostaDTO } from 'apps/auth/src/resposta/dto/criaRespostaDTO';


@Controller()
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private readonly authServico: ClientProxy) {}

  @Get('usuarios')
  async listarUsuarios(){
    return this.authServico.send(
      {
        cmd: 'get-usuarios'
      },
      {}
    )
  }
  @UseGuards(AuthGuarda)
  @Get('usuario/:id')
  async listarUsuario(@Param('id') id: string){
    return this.authServico.send(
      {
        cmd: 'get-usuario'
      }, id
    )
  }
  @Post('usuario')
  async postarUsuario(@Body() usuario: CriaUsuarioMEta){
    return this.authServico.send(
      {
        cmd: 'post-usuario'
      }, usuario
    )
  }
  @UseGuards(AuthGuarda)
  @Patch('usuario/:id')
  async atualizaUsuario(@Param('id') id: string, @Body() data: AtualiarUsuarioMeta){
    return this.authServico.send(
      {
        cmd: 'patch-usuario'
      },{id, ...data}
    )
  }
  @UseGuards(AuthGuarda)
  @Delete('usuario/:id')
  async deletarUsuario(@Param('id') id: string){
    return this.authServico.send(
      {
        cmd: 'del-usuario'
      }, id 
    )
  }
  @Get('perguntas')
  async listarPerguntas(){
    return this.authServico.send(
      {
        cmd: 'get-perguntas'
      },
      {}
    )
  }
  
  @Get('pergunta/:id')
  async listarPergunta(@Param('id') id: string){
    return this.authServico.send(
      {
        cmd: 'get-pergunta'
      },id
    )
  }
  @UseGuards(AuthGuarda)
  @Post(':id')
  async postarPergunta(@Param('id') id: string, @Body() dados: criarPerguntaDTO){
    return this.authServico.send(
      {
        cmd: 'post-pergunta'
      }, {id, ...dados}
    )
  }
 
  @Put('pergunta/:id')
  async atualizaPergunta(@Param('id') id: string, @Body() dados: AtualizarPergunta){
    return this.authServico.send(
      {
        cmd: 'put-pergunta'
      },{id, ...dados}
    )
  }
  @UseGuards(AuthGuarda)
  @Delete('pergunta/:id/:id2')
  async deletarPergunta(@Param('id') idUsuarioQueCriou: string, @Param('id2') idPergunta: string){
    return this.authServico.send(
      {
        cmd: 'del-pergunta'
      }, {idUsuarioQueCriou, idPergunta} 
    )
  }

  @Patch('usuarioM/:id1/:id2/:id3')
  async perguntaAtualizaPorPrestigiado(@Param('id1') idUsuario: string, @Param('id2') idUsuarioPropio: string, @Param('id3') idPergunta: string,  @Body() dados: AtualizarPergunta) {
    return this.authServico.send(
      {
        cmd: 'put-perguntaPrestigio'
      }, {idUsuario, idUsuarioPropio, idPergunta, dados}
    )
  }
  
  @Put('comentarioP/:id1/:id2/:id3')
  async comentarioAtualiza(@Param('id1') usuarioQueCriou: string, @Param('id2') idPergunta: string, @Param('id3') id: string,  @Body() dados: AtualizaComentarioDTO) {
    return this.authServico.send(
      {
        cmd: 'put-comentarioAtualiaza'
      }, {usuarioQueCriou, idPergunta, id, dados}
    )
  }
  @UseGuards(AuthGuarda)
  @Post('meucomentario/:id/:id2')
  async comentarioPropio(@Param('id') idUsuarioPropio: string, @Param('id2') idPergunta: string,@Body() dados: criarComentarioDTO){
    return this.authServico.send(
      {
        cmd: 'post-comentarioPr'
      }, {idUsuarioPropio, idPergunta, dados}
    )
  }
  @UseGuards(AuthGuarda)
  @Delete('comentarioD/:id/:id2')
  async deletarComentario(@Param('id') usuarioCriador: string, @Param('id2') id: string){
    return this.authServico.send(
      {
        cmd: 'del-comentarioDeleta'
      }, { usuarioCriador ,id} 
    )
  }
  @Get('comentarios')
  async listarComentarios(){
    return this.authServico.send(
      {
        cmd: 'get-listaComentarios'
      },
      {}
    )
  }
  @Get('comentarioP/:id')
  async listarComentario(@Param('id') id: string){
    return this.authServico.send(
      {
        cmd: 'get-listaComentario'
      }, id
    )
  }
  @Get('respostas')
  async listarRespostas(){
    return this.authServico.send(
      {
        cmd: 'get-respostas'
      },{}
    )
  }
  @Get('respostaP/:id')
  async listarResposta(@Param('id') id: string){
    return this.authServico.send(
      {
        cmd: 'get-resposta'
      },id
    )
  }
  @Put('respostaM/:id1/:id2/:id3/:id4')
  async respostaAtualizaPorPrestigiado(@Param('id1') idUsuario: string,@Param('id2') idUsuarioPropio: string ,@Param('id3') idPergunta: string, @Param('id4') idResposta: string,  @Body() dados: atualizaEspecificoRespostaDTO) {
    return this.authServico.send(
      {
        cmd: 'put- respostaAtualizaComPrestigio'
      }, {idUsuario, idUsuarioPropio  ,idPergunta, idResposta, dados}
    )
  }
  
  @Put('respostaP/:id1/:id2/:id3')
  async respostaAtualiza(@Param('id1') idUsuario: string, @Param('id2') idPergunta: string, @Param('id3') idResposta: string,  @Body() dados: atualizaRespostaDTO) {
    return this.authServico.send(
      {
        cmd: 'put-respostaAtualiza'
      }, {idUsuario, idPergunta, idResposta, dados}
    )
  }
  @UseGuards(AuthGuarda)
  @Delete('respostaD/:id/:id2')
  async deletarResposta(@Param('id') idusuarioCriador: string, @Param('id2') idResposta: string){
    return this.authServico.send(
      {
        cmd: 'del-resposta'
      }, { idusuarioCriador ,idResposta} 
    )
  }
  @UseGuards(AuthGuarda)
  @Post('resposta/:id/:id2')
  async postarResposta(@Param('id') idUsuario: string, @Param('id2') idPergunta: string,@Body() dados: criaRespostaDTO){
    return this.authServico.send(
      {
        cmd: 'post-resposta'
      }, {idUsuario, idPergunta, dados}
    )
  }
  @UseGuards(AuthGuarda)
  @Post('comentarioResposta/:id/:id2')
  async comentario2Resposta(@Param('id') idUsuario: string , @Param('id2') idResposta: string ,@Body() dados: criarComentarioRespostaDTO){
    return this.authServico.send(
      {
        cmd: 'post-Comentario2Resposta'
      }, {idUsuario, idResposta, dados}
    )
  }
  @Put('comentarioResposta/:id1/:id2/:id3')
  async comentario2Atualiza(@Param('id1') usuarioQueCriou: string, @Param('id2') idResposta: string, @Param('id3') idComentario: string,  @Body() dados: atualizarComentarioRespostaDTO) {
    return this.authServico.send(
      {
        cmd: 'put-comentario2Atualiaza'
      }, {usuarioQueCriou, idResposta, idComentario, dados}
    )
  }  
  @UseGuards(AuthGuarda)
  @Delete('comentarioResposta/:id/:id2')
  async deletar2Comentario(@Param('id') idUsuarioCriador: string, @Param('id2') idComentario: string){
    return this.authServico.send(
      {
        cmd: 'del-comentario2Deleta'
      }, {idUsuarioCriador, idComentario} 
    )
  }
  @Get('comentariosRespostas')
  async listar2Comentarios(){
    return this.authServico.send(
      {
        cmd: 'get-lista2Comentarios'
      },
      {}
    )
  }
  @Get('comentarioResposta/:id')
  async listar2Comentario(@Param('id') id: string){
    return this.authServico.send(
      {
        cmd: 'get-lista2Comentario'
      }, id
    )
  }
  @Post('loginUsuario/:id')
  async autenticaUsuario(@Param('id') id: string, @Body() dados: AutenticaDTO){
    return this.authServico.send(
      {
        cmd: 'login'
      },{id, dados}
    )
  }
}
