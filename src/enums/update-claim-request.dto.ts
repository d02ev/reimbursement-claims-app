import { PartialType } from '@nestjs/mapped-types';
import { GenerateClaimRequestDto } from './generate-claim-request.dto';

export class UpdateClaimRequestDto extends PartialType(
	GenerateClaimRequestDto,
) {
	claimId: string;
}
