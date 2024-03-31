/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class AutenticaDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  senha: string;
}
