import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/user/enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _authService: AuthService,
    private readonly _configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('JWT_SECRET_KEY'),
    });
  }

  public async validate(payload: {
    id: string;
    email: string;
    roles: Role[];
    isApprover: boolean;
  }): Promise<any> {
    const user = await this._authService.validateUser(payload.id);

    if (!user) {
      throw new HttpException('Invalid Token!', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
