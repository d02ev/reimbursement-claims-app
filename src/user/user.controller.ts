import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticatedGuard } from 'src/auth/guards';
import { GetUser, UseRole } from 'src/auth/decorators';
import { Role } from './enum';
import { EditUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.ADMIN)
  @Get()
  public async getAllUsers(): Promise<any> {
    return this._userService.getAllUsers();
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':userId')
  public async getMe(@Param('userId') userId: string): Promise<any> {
    return this._userService.getUserById(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.ADMIN)
  @Get('admins')
  public async getAllAdmins(): Promise<any> {
    return this._userService.getAllAdmins();
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.ADMIN)
  @Get('approvers')
  public async getAllApprovers(): Promise<any> {
    return this._userService.getAllApprovers();
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.ADMIN)
  @Patch('grant/admin/:userId')
  public async makeAdmin(@GetUser('id') userId: string): Promise<any> {
    return this._userService.makeAdmin(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.ADMIN)
  @Patch('revoke/admin/:userId')
  public async revokeAdmin(@GetUser('id') userId: string): Promise<any> {
    return this._userService.removeAdmin(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.ADMIN)
  @Patch('make/approver/:userId')
  public async makeApprover(@GetUser('id') userId: string): Promise<any> {
    return this._userService.makeApprover(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.ADMIN)
  @Patch('remove/approver/:userId')
  public async removeApprover(@GetUser('id') userId: string): Promise<any> {
    return this._userService.removeApprover(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.USER)
  @Patch(':userId')
  public async updateUser(
    @GetUser('id') userId: string,
    @Body() updatedData: EditUserDto,
  ): Promise<any> {
    return this._userService.updateUser(userId, updatedData);
  }
}
