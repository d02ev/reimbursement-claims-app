import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards';
import { GetUser, UseRole } from 'src/auth/decorators';
import { Role } from './enum';
import { EditUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN])
  @Get()
  public async getAllUsers(): Promise<any> {
    return this._userService.getAllUsers();
  }

  @UseGuards(JwtGuard)
  @Get(':userId')
  public async getMe(@Param('userId') userId: string): Promise<any> {
    return this._userService.getUserById(userId);
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN])
  @Get('admins/all')
  public async getAllAdmins(): Promise<any> {
    return this._userService.getAllAdmins();
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN])
  @Get('approvers/all')
  public async getAllApprovers(): Promise<any> {
    return this._userService.getAllApprovers();
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN])
  @Patch('grant/admin/:userId')
  public async makeAdmin(@Param('userId') userId: string): Promise<any> {
    return this._userService.makeAdmin(userId);
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN])
  @Patch('revoke/admin/:userId')
  public async revokeAdmin(@Param('userId') userId: string): Promise<any> {
    return this._userService.removeAdmin(userId);
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN])
  @Patch('make/approver/:userId')
  public async makeApprover(@Param('userId') userId: string): Promise<any> {
    return this._userService.makeApprover(userId);
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN])
  @Patch('remove/approver/:userId')
  public async removeApprover(@Param('userId') userId: string): Promise<any> {
    return this._userService.removeApprover(userId);
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.USER])
  @Patch(':userId')
  public async updateUser(
    @GetUser('id') userId: string,
    @Body() updatedData: EditUserDto,
  ): Promise<any> {
    return this._userService.updateUser(userId, updatedData);
  }
}
