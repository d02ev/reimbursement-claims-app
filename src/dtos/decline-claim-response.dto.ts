import { HttpStatusCodes } from '../enums';

export class DeclineClaimResponseDto {
	private readonly statusCode: number;
	private readonly message: string;

	constructor(declinedClaimId: string) {
		this.statusCode = HttpStatusCodes.OK;
		this.message = `Claim Id '${declinedClaimId}' declined successfully.`;
	}
}
