/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, of, switchMap } from 'rxjs';


@Injectable()
export class AuthGuarda implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  canActivate(contexto: ExecutionContext): boolean |  Promise<boolean> | Observable<boolean> {
    if(contexto.getType() !== 'http') {
        return false
    }

    const requisicao = contexto.switchToHttp().getRequest()
    const header = requisicao.headers['authorization']
    
    if(!header) return false;

    const authHeaderParts = (header as string).split(' ');

    if (authHeaderParts.length !== 2) return false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, jwt] = authHeaderParts;

    const {id} = requisicao.params

    return this.authService.send({cmd : 'verificar-token'}, {jwt, id}).pipe(
      switchMap(({exp}) => {
        const TOKEN_EXP = exp * 1000

        const jwtValido = Date.now() < TOKEN_EXP

        return of(jwtValido)
      }),
      catchError(() => {
        throw new UnauthorizedException("Token Expirado ou Invalido")
      })
    )
  }
}
