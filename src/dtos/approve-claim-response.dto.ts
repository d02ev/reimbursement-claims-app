import { HttpStatusCodes } from '../enums';

export class ApproveClaimResponseDto {
	private readonly statusCode: number;
	private readonly message: string;

	constructor(approvedClaimId: string) {
		this.statusCode = HttpStatusCodes.OK;
		this.message = `Claim Id '${approvedClaimId}' approved successfully.`;
	}
}
