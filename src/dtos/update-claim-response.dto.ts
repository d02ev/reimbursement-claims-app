import { HttpStatusCodes } from '../enums';

export class UpdateClaimResponseDto {
	private readonly statusCode: number;
	private readonly message: string;

	constructor(updatedClaimId: string) {
		this.statusCode = HttpStatusCodes.OK;
		this.message = `Claim Id '${updatedClaimId}' updated successfully.`;
	}
}
