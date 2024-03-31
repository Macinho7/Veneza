/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { LibService } from '@app/lib';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)

  const libsService = app.get(LibService)
  const configService = app.get(ConfigService)

  const queue =  configService.get('RABBITMQ_AUTH_QUEUE')
  app.connectMicroservice(libsService.moduloRmq(queue))
  app.startAllMicroservices()
}
bootstrap();
