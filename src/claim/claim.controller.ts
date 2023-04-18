import {
  Controller,
  UseGuards,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { GetUser, UseRole } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { Role } from 'src/user/enum';
import {
  ApproveClaimDto,
  CreateClaimDto,
  DeclineClaimDto,
  EditClaimDto,
} from './dto';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ClaimService } from './claim.service';

@Controller('claim')
export class ClaimController {
  constructor(private readonly _claimService: ClaimService) {}

  @UseGuards(JwtGuard)
  @UseRole([Role.USER])
  @Post()
  @UseInterceptors(
    FileInterceptor('receipt', {
      storage: diskStorage({
        destination: './client/src/assets/receipts',
        filename: (req, file, cb) => {
          return cb(
            null,
            `${Date.now()}_${file.fieldname}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  public async generate(
    @Body() claimData: CreateClaimDto,
    @UploadedFile() receiptImg: Express.Multer.File,
    @GetUser('id') userId: string,
  ): Promise<any> {
    claimData.receipt = receiptImg.filename;
    claimData.requestedBy = userId;
    return await this._claimService.generateClaim(claimData);
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN, Role.APPROVER])
  @Get()
  public async getAllClaims(): Promise<any> {
    return await this._claimService.getAllClaims();
  }

  @UseGuards(JwtGuard)
  @Get('user')
  public async getAllUserClaims(@GetUser('id') userId: string): Promise<any> {
    return await this._claimService.getClaimByUser(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':claimId')
  public async getClaimById(
    @Param('claimId') claimId: string,
    @GetUser('id') userId: string,
  ): Promise<any> {
    return await this._claimService.getClaimById(claimId, userId);
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN, Role.APPROVER])
  @Get('pending/all')
  public async getAllPendingClaims(): Promise<any> {
    return await this._claimService.getAllPendingClaims();
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN, Role.APPROVER])
  @Get('approved/all')
  public async getAllApprovedClaims(): Promise<any> {
    return await this._claimService.getAllApprovedClaims();
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN, Role.APPROVER])
  @Get('declined/all')
  public async getAllDeclinedClaims(): Promise<any> {
    return await this._claimService.getAllDeclinedClaims();
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN, Role.APPROVER])
  @Patch('approve/:claimId')
  public async approveClaim(
    @Param('claimId') claimId: string,
    @Body() approvingData: ApproveClaimDto,
    @GetUser('email') userEmail: string,
  ): Promise<any> {
    approvingData.approvedBy = userEmail;
    return await this._claimService.approveClaim(claimId, approvingData);
  }

  @UseGuards(JwtGuard)
  @UseRole([Role.ADMIN, Role.APPROVER])
  @Patch('decline/:claimId')
  public async declineClaim(
    @Param('claimdId') claimId: string,
    @Body() decliningData: DeclineClaimDto,
    @GetUser('email') userEmail: string,
  ): Promise<any> {
    decliningData.declinedBy = userEmail;
    return await this._claimService.declineClaim(claimId, decliningData);
  }

  @UseGuards(JwtGuard)
  @Patch('edit/:claimId')
  @UseInterceptors(
    FileInterceptor('receipt', {
      storage: diskStorage({
        destination: './client/src/assets/receipts',
        filename: (req, file, cb) => {
          return cb(
            null,
            `${Date.now()}_${file.fieldname}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  public async editClaim(
    @Param('claimId') claimId: string,
    @UploadedFile() receiptImg: Express.Multer.File,
    @GetUser('id') userId: string,
    @Body() updatedClaimData: EditClaimDto,
  ): Promise<any> {
    if (receiptImg) {
      updatedClaimData.receipt = receiptImg.path;
    }

    return await this._claimService.editClaim(
      claimId,
      userId,
      updatedClaimData,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:claimId')
  public async deleteClaim(
    @Param('claimId') claimId: string,
    @GetUser('id') userId: string,
  ): Promise<any> {
    return this._claimService.deleteClaim(claimId, userId);
  }
}
