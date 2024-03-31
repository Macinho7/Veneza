/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types'
import { criarPerguntaDTO } from './criaPerguntaDTO';
export class AtualizarPergunta extends PartialType(criarPerguntaDTO){}
