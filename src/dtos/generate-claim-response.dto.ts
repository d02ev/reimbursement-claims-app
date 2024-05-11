import { HttpStatusCodes } from '../enums';

export class GenerateClaimResponseDto {
	private readonly statusCode: number;
	private readonly message: string;

	constructor(generatedClaimId: string) {
		this.statusCode = HttpStatusCodes.CREATED;
		this.message = `Claim generated successfully. Your claim Id is '${generatedClaimId}'.`;
	}
}
