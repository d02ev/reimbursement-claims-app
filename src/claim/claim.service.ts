import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  ApproveClaimDto,
  BaseClaimDto,
  CreateClaimDto,
  DeclineClaimDto,
  EditClaimDto,
} from './dto';
import { RequestPhase } from './enum';

@Injectable()
export class ClaimService {
  constructor(private readonly _databaseService: DatabaseService) {}

  public async generateClaim(creationData: CreateClaimDto): Promise<any> {
    const newClaimData: BaseClaimDto = {
      date: creationData.date,
      type: creationData.type,
      requestedAmt: parseFloat(creationData.requestedAmt),
      currency: creationData.currency,
      receipt: creationData.receipt,
      requestedBy: creationData.requestedBy,
    };
    const newClaim = await this._databaseService.claim.create({
      data: { ...newClaimData },
    });

    if (!newClaim) {
      throw new HttpException(
        'An Unknown Error Occurred While Creating The Claim Request!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 201,
      message: 'Claim Generated Successfully!',
    };
  }

  public async getAllClaims(): Promise<any> {
    const claims = await this._databaseService.claim.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return claims;
  }

  public async getAllPendingClaims(): Promise<any> {
    const pendingClaims = await this._databaseService.claim.findMany({
      where: { requestPhase: RequestPhase.IN_PROCESS },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return pendingClaims;
  }

  public async getAllApprovedClaims(): Promise<any> {
    const approvedClaims = await this._databaseService.claim.findMany({
      where: { requestPhase: RequestPhase.APPROVED },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return approvedClaims;
  }

  public async getAllDeclinedClaims(): Promise<any> {
    const declinedClaims = await this._databaseService.claim.findMany({
      where: {
        requestPhase: RequestPhase.DECLINED,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return declinedClaims;
  }

  public async getClaimById(claimId: string, userId: string): Promise<any> {
    const claim = await this._databaseService.claim.findFirst({
      where: { id: claimId },
    });

    if (!claim) {
      throw new HttpException(
        'Requested Claim Does Not Exist!',
        HttpStatus.NOT_FOUND,
      );
    }
    if (claim.requestedBy !== userId) {
      throw new HttpException(
        'The Requested Resource Does Not Belong To You!',
        HttpStatus.FORBIDDEN,
      );
    }

    return claim;
  }

  public async getClaimByUser(userId: string): Promise<any> {
    const claims = await this._databaseService.claim.findMany({
      where: { requestedBy: userId },
    });

    return claims;
  }

  public async approveClaim(
    claimId: string,
    approvingData: ApproveClaimDto,
  ): Promise<any> {
    const claim = await this._databaseService.claim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      throw new HttpException(
        'Requested Claim Does Not Exist!',
        HttpStatus.NOT_FOUND,
      );
    }

    if (claim.requestPhase === RequestPhase.APPROVED) {
      throw new HttpException(
        'Claim Has Already Been Approved!',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (claim.requestPhase === RequestPhase.DECLINED) {
      throw new HttpException(
        'Cannot Approve A Declined Claim!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const _$: EditClaimDto = {
      approvedAmt: parseFloat(approvingData.approvedAmt),
      requestPhase: RequestPhase.APPROVED,
      internalNotes: approvingData.internalNotes,
      approvedBy: approvingData.approvedBy,
    };

    const approvedClaim = await this._databaseService.claim.update({
      where: { id: claimId },
      data: { ..._$ },
    });

    if (!approvedClaim) {
      throw new HttpException(
        'Cannot Approve The Claim Due To An Unknown Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 200,
      message: 'Claim Has Been Approved Successfully!',
    };
  }

  public async declineClaim(
    claimId: string,
    decliningData: DeclineClaimDto,
  ): Promise<any> {
    const claim = await this._databaseService.claim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      throw new HttpException(
        'Requested Claim Does Not Exist!',
        HttpStatus.NOT_FOUND,
      );
    }
    if (claim.requestPhase === RequestPhase.DECLINED) {
      throw new HttpException(
        'Claim Has Already Been Declined!',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (claim.requestPhase === RequestPhase.APPROVED) {
      throw new HttpException(
        'Cannot Decline An Approved Claim!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const _$: EditClaimDto = {
      internalNotes: decliningData.internalNotes,
      approvedAmt: decliningData.approvedAmt,
      requestPhase: RequestPhase.DECLINED,
      declinedBy: decliningData.declinedBy,
    };

    const declinedClaim = await this._databaseService.claim.update({
      where: { id: claimId },
      data: { ..._$ },
    });

    if (!declinedClaim) {
      throw new HttpException(
        'Cannot Decline The Claim Due To An Unknown Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 200,
      message: 'Claim Has Been Declined Successfully!',
    };
  }

  public async editClaim(
    claimId: string,
    userId: string,
    modifiedData: EditClaimDto,
  ): Promise<any> {
    const claim = await this._databaseService.claim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      throw new HttpException(
        'Requested Claim Does Not Exist!',
        HttpStatus.NOT_FOUND,
      );
    }
    if (claim.requestedBy !== userId) {
      throw new HttpException(
        'The Requested Resource Does Not Belong To You!',
        HttpStatus.FORBIDDEN,
      );
    }

    const modifiedClaim = await this._databaseService.claim.update({
      where: { id: claimId },
      data: { ...modifiedData },
    });

    if (!modifiedClaim) {
      throw new HttpException(
        'Cannot Edit The Claim Due To An Unknown Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 200,
      message: 'Claim Has Been Modified Successfully!',
    };
  }

  public async deleteClaim(claimId: string, userId: string): Promise<any> {
    const claim = await this._databaseService.claim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      throw new HttpException(
        'Requested Claim Does Not Exist!',
        HttpStatus.NOT_FOUND,
      );
    }
    if (claim.requestedBy !== userId) {
      throw new HttpException(
        'The Requested Resource Does Not Belong To You!',
        HttpStatus.FORBIDDEN,
      );
    }

    const deletedClaim = await this._databaseService.claim.delete({
      where: { id: claimId },
    });

    if (!deletedClaim) {
      throw new HttpException(
        'Cannot Delete Claim Due To An Unknown Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: 200,
      message: 'Claim Deleted Successfully!',
    };
  }
}
