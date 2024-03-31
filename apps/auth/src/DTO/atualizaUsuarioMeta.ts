/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsStrongPassword, IsUUID } from 'class-validator';

export class AtualiarUsuarioMeta {
  @IsUUID()
  id: string
  @IsNotEmpty()
  nome: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 3,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  senha: string;
}
