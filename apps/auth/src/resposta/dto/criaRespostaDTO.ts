/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsUUID } from 'class-validator';

export class criaRespostaDTO {
  @IsUUID()
  id: string;

  voto: number
  @IsNotEmpty()
  resposta: string;

}
