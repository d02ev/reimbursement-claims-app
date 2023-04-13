import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string): Promise<any> {
    const loginData: LoginDto = {
      email,
      password,
    };
    const user = await this._authService.validateUser(loginData);

    if (!user) {
      throw new HttpException('Invalid Credentials!', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
