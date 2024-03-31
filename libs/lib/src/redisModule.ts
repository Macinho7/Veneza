/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager"
import { redisStore } from "cache-manager-redis-yet"
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: configService.get('REDIS_URI'),
        }),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class RedisModule {}
