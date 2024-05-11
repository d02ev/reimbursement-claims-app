import { HttpStatusCodes } from '../enums';

export class DeleteClaimResponseDto {
	private readonly statusCode: number;
	private readonly message: string;

	constructor(deletedClaimId: string) {
		this.statusCode = HttpStatusCodes.OK;
		this.message = `Claim Id '${deletedClaimId}' deleted successfully.`;
	}
}
