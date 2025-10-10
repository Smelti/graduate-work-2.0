import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/users.schema';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const request = context.switchToHttp().getRequest();
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    const user = request.user as JwtPayload;
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    if (!user) throw new UnauthorizedException();

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Forbidden resource');
    }

    return true;
  }
}
