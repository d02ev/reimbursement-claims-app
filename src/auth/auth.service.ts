import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _databaseService: DatabaseService,
  ) {}

  public async register(registrationData: CreateUserDto): Promise<any> {
    return await this._userService.createUser(registrationData);
  }

  public login(): any {
    return {
      status: 200,
      message: 'User Logged In Successfully!',
    };
  }

  public async validateUser(loginData: LoginDto): Promise<any> {
    const user = await this._databaseService.user.findUnique({
      where: { email: loginData.email },
      select: {
        id: true,
        email: true,
        isApprover: true,
        roles: true,
        passwordHash: true,
      },
    });

    if (user && (await Bcrypt.compare(loginData.password, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...rest } = user;
      return rest;
    }

    return null;
  }
}
