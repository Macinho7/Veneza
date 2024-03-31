/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsUUID } from "class-validator";

export class AtualizaComentarioDTO {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  comentario: string;
}
