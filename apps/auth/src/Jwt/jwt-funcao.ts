/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtRequisicao } from './jwtSignRe';
@Injectable()
export class JwtRetira extends PassportStrategy(Strategy) {
    constructor() {
     super({
         jwtDaRequisicao: ExtractJwt.fromExtractors([
             (request: JwtRequisicao) => {
                 return request?.jwt
             }
         ]),
         ignoreExpiration: false,
         secretOrkey: process.env.JWT_SEGREDO
     })
   }

   async validate(payload: any) {
    return { ...payload}
   }
}
