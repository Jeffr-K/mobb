import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheRepository } from 'src/infrastructure/database/redis/redis.repository';
import { RedisCacheService } from 'src/infrastructure/database/redis/redis.service';
import { OAuthController } from './interface/controller/oauth.controller';
import { AuthController } from './interface/controller/auth.controller';
import { LoginCommandEventHandler, LogoutCommandEventHandler } from './core/command/login.command.handler';
import { TokenService } from './core/service/token.service';
import {
  SecureSessionRepository,
  SecureSessionCacheRepository,
} from './infrastructure/persistance/secure.sesion.concrete-repository';
import { TokenGenerator } from './infrastructure/utils/token.generator';
import { TokenValidator } from './infrastructure/utils/token.validator';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from 'src/infrastructure/database/redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthGuard } from './infrastructure/guard/token.guard';
import { JwtAuthGuard } from './infrastructure/guard/jwt.guard';
import { JwtStrategy } from './infrastructure/stargegy/jwt.strategy';
import { EntityManager } from '@mikro-orm/postgresql';
import { SecureSession } from '@modules/auth/core/entity/secure.session';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({ envFilePath: 'src/infrastructure/configs/.dev.env' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
    }),
    RedisModule,
    PassportModule,
    MikroOrmModule.forFeature([SecureSession]),
  ],
  providers: [
    JwtStrategy,
    RedisCacheService,
    RedisCacheRepository,
    LoginCommandEventHandler,
    LogoutCommandEventHandler,
    TokenService,
    TokenGenerator,
    TokenValidator,
    SecureSessionCacheRepository,
    AuthGuard,
    ConfigService,
    JwtAuthGuard,
    {
      provide: SecureSessionRepository,
      useFactory: (em: EntityManager) => {
        return new SecureSessionRepository(em, SecureSession);
      },
      inject: [EntityManager],
    },
  ],
  controllers: [AuthController, OAuthController],
  exports: [AuthGuard],
})
export class AuthModule {}
