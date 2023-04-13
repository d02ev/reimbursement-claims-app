import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  public async register(@Body() registrationData: CreateUserDto): Promise<any> {
    return await this._authService.register(registrationData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public login(): any {
    return this._authService.login();
  }
}
