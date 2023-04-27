import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseUserDto, CreateUserDto, EditUserDto } from './dto';
import { Role } from './enum';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly _databaseService: DatabaseService) {}

  public async createUser(creationData: CreateUserDto): Promise<any> {
    const user = await this._databaseService.user.findFirst({
      where: {
        email: creationData.email,
        PAN: creationData.PAN,
        bankAccountNumber: creationData.bankAccountNumber,
      },
    });

    if (user) {
      throw new HttpException('User Already Exists!', HttpStatus.BAD_REQUEST);
    }

    const isAdmin =
      creationData.email === 'super.admin@example.com' ? true : false;
    const roles: number[] = [];

    if (isAdmin) {
      roles.push(Role.SUPER_ADMIN);
    } else {
      roles.push(Role.USER);
    }

    const passwordHash = await Bcrypt.hash(creationData.password, 10);
    const newUserData: BaseUserDto = {
      fullName: creationData.fullName,
      email: creationData.email,
      PAN: creationData.PAN,
      bankName: creationData.bankName,
      bankAccountNumber: creationData.bankAccountNumber,
      roles: roles,
      passwordHash: passwordHash,
    };

    const newUser = await this._databaseService.user.create({
      data: { ...newUserData },
    });

    if (!newUser) {
      throw new HttpException(
        'An Unknown Error Occurred While Creating The User!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 201,
      message: 'User Created Successfully!',
    };
  }

  public async getAllUsersForApprovers(
    loggedInAdminEmail: string,
  ): Promise<any> {
    const users = await this._databaseService.user.findMany({
      where: {
        email: {
          not: loggedInAdminEmail,
        },
        NOT: {
          roles: {
            hasSome: [Role.APPROVER, Role.SUPER_ADMIN],
          },
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        PAN: true,
        bankName: true,
        bankAccountNumber: true,
      },
    });

    return users;
  }

  public async getAllUsersForAdmins(
    loggedInSuperAdminEmail: string,
  ): Promise<any> {
    const users = await this._databaseService.user.findMany({
      where: {
        email: {
          not: loggedInSuperAdminEmail,
        },
        NOT: {
          roles: {
            has: Role.ADMIN,
          },
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        PAN: true,
        bankName: true,
        bankAccountNumber: true,
      },
    });

    return users;
  }

  public async getAllApprovers(): Promise<any> {
    const approvers = await this._databaseService.user.findMany({
      where: { isApprover: true },
      select: {
        id: true,
        fullName: true,
        email: true,
        PAN: true,
        bankName: true,
        bankAccountNumber: true,
      },
    });

    return approvers;
  }

  public async getAllAdmins(): Promise<any> {
    const admins = await this._databaseService.user.findMany({
      where: {
        roles: {
          has: Role.ADMIN,
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        PAN: true,
        bankName: true,
        bankAccountNumber: true,
      },
    });

    return admins;
  }

  public async getUserById(userId: string): Promise<any> {
    const user = await this._databaseService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        PAN: true,
        bankName: true,
        bankAccountNumber: true,
      },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async getUserByEmail(userEmail: string): Promise<any> {
    const user = await this._databaseService.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        fullName: true,
        email: true,
        PAN: true,
        bankName: true,
        bankAccountNumber: true,
      },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async makeAdmin(userId: string): Promise<any> {
    const user = await this._databaseService.user.findUnique({
      where: { id: userId },
      select: {
        roles: true,
      },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    if (user.roles.includes(Role.ADMIN)) {
      throw new HttpException(
        'User Already Has Admin Privileges!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userRoles = user.roles;
    if (userRoles.length === 1) {
      userRoles[0] = Role.ADMIN;
    } else {
      for (let i = 0; i < userRoles.length; ++i) {
        if (userRoles[i] === Role.USER) {
          userRoles[i] = Role.ADMIN;
        }
      }
    }

    const admin = await this._databaseService.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: userRoles,
        },
      },
    });

    if (!admin) {
      throw new HttpException(
        'Cannot Make The User Admin Due To An Unknown Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 200,
      message: 'User Now Has Admin Rights!',
    };
  }

  public async removeAdmin(userId: string): Promise<any> {
    const user = await this._databaseService.user.findUnique({
      where: { id: userId },
      select: {
        roles: true,
      },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    if (user.roles.includes(Role.USER)) {
      throw new HttpException(
        "User's Admin Rights Have Already Been Revoked!",
        HttpStatus.BAD_REQUEST,
      );
    }

    const userRoles = user.roles;
    if (userRoles.length === 1) {
      userRoles[0] = Role.USER;
    } else {
      for (let i = 0; i < userRoles.length; ++i) {
        if (userRoles[i] === Role.ADMIN) {
          userRoles[i] = Role.USER;
        }
      }
    }

    const notAdmin = await this._databaseService.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: userRoles,
        },
      },
    });

    if (!notAdmin) {
      throw new HttpException(
        'Cannot Revoke User Admin Rights Due To An Unknown Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 200,
      message: 'User Admin Rights Revoked!',
    };
  }

  public async makeApprover(userId: string): Promise<any> {
    const user = await this._databaseService.user.findUnique({
      where: { id: userId },
      select: {
        isApprover: true,
        roles: true,
      },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    if (user.isApprover) {
      throw new HttpException(
        'User Is Already An Approver!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const approver = await this._databaseService.user.update({
      where: { id: userId },
      data: {
        isApprover: true,
        roles: {
          push: Role.APPROVER,
        },
      },
    });

    if (!approver) {
      throw new HttpException(
        'Cannot Make The User Approver Due To An Unknown Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 200,
      message: 'User Can Now Approve Claims!',
    };
  }

  public async removeApprover(userId: string): Promise<any> {
    const user = await this._databaseService.user.findUnique({
      where: { id: userId },
      select: {
        isApprover: true,
        roles: true,
      },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    if (!user.isApprover) {
      throw new HttpException(
        'User Does Not Have Approver Rights!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userRoles = user.roles.includes(Role.ADMIN) ? Role.ADMIN : Role.USER;

    const notApprover = await this._databaseService.user.update({
      where: { id: userId },
      data: {
        isApprover: false,
        roles: {
          set: userRoles,
        },
      },
    });

    if (!notApprover) {
      throw new HttpException(
        'Cannot Revoke The User As Approver Due To An Unknown Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 200,
      message: "User's Approver Rights Have Been Revoked!",
    };
  }

  public async updateUser(
    userId: string,
    updatedData: EditUserDto,
  ): Promise<any> {
    const user = await this._databaseService.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        'User Does Not Exist!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (updatedData.email && updatedData.email.includes('admin')) {
      throw new HttpException(
        'The Email Address Is Restricted And Cannot Be Taken!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedUser = await this._databaseService.user.update({
      where: { id: userId },
      data: { ...updatedData },
    });

    if (!updatedUser) {
      throw new HttpException(
        'User Cannot Be Updated Due To An Unknown Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 200,
      message: 'User Details Updated Successfully!',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async resetPassword(): Promise<any> {}

  public async deleteUser(userId: string): Promise<any> {
    const user = await this._databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    const deletedUser = await this._databaseService.user.delete({
      where: { id: userId },
    });

    if (!deletedUser) {
      throw new HttpException(
        'User Cannot Be Deleted Due To An Unknown Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 200,
      message: 'User Deleted Successfully!',
    };
  }
}
