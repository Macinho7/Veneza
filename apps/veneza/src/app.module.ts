/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { rmqModule } from '@app/lib';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [rmqModule.registrarRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE), PrometheusModule.register()],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
