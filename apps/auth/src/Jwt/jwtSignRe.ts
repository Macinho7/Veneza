/* eslint-disable prettier/prettier */
 /* eslint-disable prettier/prettier */
import { Request } from 'express'

export interface JwtRequisicao extends Request {
     jwt?: string
}
