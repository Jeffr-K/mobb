// import { Injectable, UnauthorizedException, ExecutionContext, CanActivate, ForbiddenException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { Reflector } from '@nestjs/core';
// import { Request } from 'express';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { UserLookupEvent } from '@modules/user/core/event/handler/event/user.query.event';

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//     private readonly reflector: Reflector,
//     private readonly eventEmitter: EventEmitter2,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);

//     if (!token) {
//       throw new UnauthorizedException('토큰이 입력되지 않았습니다.');
//     }

//     const payload = await this.jwtService.verifyAsync(token, {
//       secret: await this.configService.get('JWT_SECRET'),
//     });

//     const user = await this.eventEmitter
//       .emitAsync('user.lookup', new UserLookupEvent({ userId: payload.userId }))
//       .then((results) => results[0]);

//     if (!user) {
//       throw new UnauthorizedException('찾는 유저가 없습니다; 잘못된 토큰 입니다.');
//     }

//     const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (!requiredRoles) {
//       request['user'] = user;
//       return true;
//     }

//     if (!requiredRoles.some((role) => user.role?.includes(role))) {
//       throw new ForbiddenException('올바른 권한이 아닙니다.');
//     }

//     return !!(request['user'] = user);
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
