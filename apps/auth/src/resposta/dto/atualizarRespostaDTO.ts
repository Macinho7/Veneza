/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsUUID } from 'class-validator';

export class atualizaRespostaDTO  {

  @IsUUID()
  id: string;

 
  @IsNotEmpty()
  resposta: string;


}
