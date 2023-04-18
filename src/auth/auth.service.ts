import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';
import * as Bcrypt from 'bcrypt';
import { Role } from 'src/user/enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _databaseService: DatabaseService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  public async register(registrationData: CreateUserDto): Promise<any> {
    return await this._userService.createUser(registrationData);
  }

  public async login(loginData: LoginDto): Promise<any> {
    const user = await this._databaseService.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    if (!(await Bcrypt.compare(loginData.password, user.passwordHash))) {
      throw new HttpException(
        'Email Or Password Does Not Match!',
        HttpStatus.FORBIDDEN,
      );
    }

    const token = await this._signToken(
      user.id,
      user.email,
      user.roles,
      user.isApprover,
    );

    return { access_token: token };
  }

  public async validateUser(id: string): Promise<any> {
    const user = await this._databaseService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        isApprover: true,
        roles: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  private _signToken(
    userId: string,
    email: string,
    roles: Role[],
    isApprover: boolean,
  ): Promise<string> {
    const payload = {
      id: userId,
      email,
      roles,
      isApprover,
    };

    return this._jwtService.signAsync(payload, {
      secret: this._configService.get('JWT_SECRET_KEY'),
      expiresIn: '30m',
    });
  }
}
