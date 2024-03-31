/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsNumber, IsStrongPassword, IsUUID } from 'class-validator';

export class CriaUsuarioMEta {
  @IsUUID()
  id: string;

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

  @IsNumber()
  
  prestigio: number

  @IsNumber()
  voteForce: number

  @IsNumber()
  valorSignificativo: number
}
