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
    const role = isAdmin ? Role.ADMIN : Role.USER;
    const isApprover = isAdmin ? true : false;
    const passwordHash = await Bcrypt.hash(creationData.password, 10);
    const newUserData: BaseUserDto = {
      fullName: creationData.fullName,
      email: creationData.email,
      PAN: creationData.PAN,
      bankName: creationData.bankName,
      bankAccountNumber: creationData.bankAccountNumber,
      isAdmin: isAdmin,
      isApprover: isApprover,
      role: role,
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

  public async getAllUsers(): Promise<any> {
    return await this._databaseService.user.findMany({
      where: { role: 0 },
      select: {
        id: true,
        fullName: true,
        email: true,
        PAN: true,
        bankName: true,
        bankAccountNumber: true,
      },
    });
  }

  public async getAllApprovers(): Promise<any> {
    return await this._databaseService.user.findMany({
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
  }

  public async getAllAdmins(): Promise<any> {
    return await this._databaseService.user.findMany({
      where: { isAdmin: true },
      select: {
        id: true,
        fullName: true,
        email: true,
        PAN: true,
        bankName: true,
        bankAccountNumber: true,
      },
    });
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
        isAdmin: true,
      },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    if (user.isAdmin) {
      throw new HttpException(
        'User Already Has Admin Rights!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const admin = await this._databaseService.user.update({
      where: { id: userId },
      data: {
        isAdmin: true,
        role: Role.ADMIN,
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
        isAdmin: true,
      },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    if (!user.isAdmin) {
      throw new HttpException(
        "User's Admin Rights Have Already Been Revoked!",
        HttpStatus.BAD_REQUEST,
      );
    }

    const notAdmin = await this._databaseService.user.update({
      where: { id: userId },
      data: {
        isAdmin: false,
        role: Role.USER,
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
        role: true,
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

    if (user.role !== Role.ADMIN) {
      throw new HttpException(
        'Only Admins Can Be Made Approvers!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const approver = await this._databaseService.user.update({
      where: { id: userId },
      data: {
        isApprover: true,
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
      },
    });

    if (!user) {
      throw new HttpException('User Does Not Exist!', HttpStatus.NOT_FOUND);
    }

    if (!user.isApprover) {
      throw new HttpException(
        'User Is Not An Approver Already!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const notApprover = await this._databaseService.user.update({
      where: { id: userId },
      data: {
        isApprover: false,
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

  public async updateUser(userId: string, updatedData: EditUserDto) {
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
      (updatedData.role = Role.ADMIN), (updatedData.isAdmin = true);
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
}
