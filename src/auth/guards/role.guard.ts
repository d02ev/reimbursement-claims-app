import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/user/enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this._reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const userRoles: Role[] = this._decodeRolesFromToken(
      req.headers.authorization,
    );
    return requiredRoles.some((role: Role) => userRoles.includes(role));
  }

  private _decodeRolesFromToken(token: string): any {
    const trimmedToken: string = token.substring(7, token.length);
    const decodedToken: any = this._jwtService.decode(trimmedToken);

    return decodedToken['roles'];
  }
}
