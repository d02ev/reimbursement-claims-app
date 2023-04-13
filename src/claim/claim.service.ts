import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseClaimDto, CreateClaimDto } from './dto';

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
}
