/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsUUID } from 'class-validator';


export class criarComentarioRespostaDTO {
    @IsUUID()
    id: string

    @IsNotEmpty()
    comentario: string
}
