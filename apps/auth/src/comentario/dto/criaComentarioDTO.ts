/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsUUID } from 'class-validator';

export class criarComentarioDTO {
    @IsUUID()
    id: string

    @IsNotEmpty()
    comentario: string
}
