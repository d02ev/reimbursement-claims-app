import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
  @UseRole(Role.SUPER_ADMIN)
  @Get('for-admins/all')
  public async getAllUsersForAdmins(
    @GetUser('email') superAdminEmail: string,
  ): Promise<any> {
    return await this._userService.getAllUsersForAdmins(superAdminEmail);
  }

  @UseGuards(JwtGuard)
  @UseRole(Role.APPROVER, Role.ADMIN)
  @Get('for-approvers/all')
  public async getAllUsersForApprovers(
    @GetUser('email') adminEmail: string,
  ): Promise<any> {
    return await this._userService.getAllUsersForApprovers(adminEmail);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  public async getMe(@GetUser('id') userId: string): Promise<any> {
    return await this._userService.getUserById(userId);
  }

  @UseGuards(JwtGuard)
  @UseRole(Role.SUPER_ADMIN)
  @Get('admins/all')
  public async getAllAdmins(): Promise<any> {
    return await this._userService.getAllAdmins();
  }

  @UseGuards(JwtGuard)
  @UseRole(Role.ADMIN)
  @Get('approvers/all')
  public async getAllApprovers(): Promise<any> {
    return await this._userService.getAllApprovers();
  }

  @UseGuards(JwtGuard)
  @UseRole(Role.SUPER_ADMIN)
  @Patch('grant/admin/:userId')
  public async makeAdmin(@Param('userId') userId: string): Promise<any> {
    return await this._userService.makeAdmin(userId);
  }

  @UseGuards(JwtGuard)
  @UseRole(Role.SUPER_ADMIN)
  @Patch('revoke/admin/:userId')
  public async revokeAdmin(@Param('userId') userId: string): Promise<any> {
    return await this._userService.removeAdmin(userId);
  }

  @UseGuards(JwtGuard)
  @UseRole(Role.ADMIN)
  @Patch('make/approver/:userId')
  public async makeApprover(@Param('userId') userId: string): Promise<any> {
    return await this._userService.makeApprover(userId);
  }

  @UseGuards(JwtGuard)
  @UseRole(Role.ADMIN)
  @Patch('remove/approver/:userId')
  public async removeApprover(@Param('userId') userId: string): Promise<any> {
    return await this._userService.removeApprover(userId);
  }

  @UseGuards(JwtGuard)
  @UseRole(Role.USER)
  @Patch(':userId')
  public async updateUser(
    @GetUser('id') userId: string,
    @Body() updatedData: EditUserDto,
  ): Promise<any> {
    return await this._userService.updateUser(userId, updatedData);
  }

  @UseGuards(JwtGuard)
  @UseRole(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':userId')
  public async deleteUser(@Param('userId') userId: string): Promise<any> {
    return await this._userService.deleteUser(userId);
  }
}
