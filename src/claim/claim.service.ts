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
      include: { user: true },
    });

    if (claims.length === 0) {
      return {
        status: 200,
        message: 'No Claims Found!',
      };
    }

    return claims;
  }

  public async getAllPendingClaims(): Promise<any> {
    const pendingClaims = await this._databaseService.claim.findMany({
      where: { requestPhase: RequestPhase.IN_PROCESS },
      include: { user: true },
    });

    if (pendingClaims.length === 0) {
      return {
        status: 200,
        message: 'No Pending Claims Found!',
      };
    }

    return pendingClaims;
  }

  public async getAllApprovedClaims(): Promise<any> {
    const approvedClaims = await this._databaseService.claim.findMany({
      where: { isApproved: true },
      include: { user: true },
    });

    if (approvedClaims.length === 0) {
      return {
        status: 200,
        message: 'No Approved Claims Found!',
      };
    }

    return approvedClaims;
  }

  public async getAllDeclinedClaims(): Promise<any> {
    const declinedClaims = await this._databaseService.claim.findMany({
      where: { isApproved: false },
      include: { user: true },
    });

    if (declinedClaims.length === 0) {
      return {
        status: 200,
        message: 'No Declined Claims Found!',
      };
    }

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

    if (claims.length === 0) {
      return {
        status: 200,
        message: 'No Claims Found For The User!',
      };
    }

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

    const approvedClaim = await this._databaseService.claim.update({
      where: { id: claimId },
      data: { ...approvingData },
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

    const declinedClaim = await this._databaseService.claim.update({
      where: { id: claimId },
      data: { ...decliningData },
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
