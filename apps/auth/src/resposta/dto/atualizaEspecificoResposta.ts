/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsUUID } from 'class-validator';

export class atualizaEspecificoRespostaDTO {
  @IsUUID()
  id: string;

  voto: number
  @IsNotEmpty()
  resposta: string;

}
