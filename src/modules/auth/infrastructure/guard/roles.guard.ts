import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@modules/user/core/value/enum/role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }
    if (!user.role) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const hasRole = requiredRoles.some((role) => user.role?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('올바른 권한이 아닙니다.');
    }

    return true;
  }
}
