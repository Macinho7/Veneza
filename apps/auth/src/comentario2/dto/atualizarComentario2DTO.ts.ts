/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { criarComentarioRespostaDTO } from './criarComentario2DTO';

export class atualizarComentarioRespostaDTO extends PartialType(criarComentarioRespostaDTO) {}
