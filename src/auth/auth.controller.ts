import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  public async register(@Body() registrationData: CreateUserDto): Promise<any> {
    return await this._authService.register(registrationData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginData: LoginDto): Promise<any> {
    return await this._authService.login(loginData);
  }
}
