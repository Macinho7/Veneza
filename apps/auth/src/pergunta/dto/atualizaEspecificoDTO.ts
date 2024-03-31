/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsUUID, MaxLength } from "class-validator";

export class atualizaEspecificoDTO {
  @IsUUID()
  id: string;

  
  voto: number
  
  @IsNotEmpty()
  @MaxLength(100, { message: 'limite de 100 caracteres de titulo' })
  titulo: string;

  @IsNotEmpty()
  pergunta: string;
}
