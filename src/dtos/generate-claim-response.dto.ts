import { HttpStatusCodes } from '../enums';

export class GenerateClaimResponseDto {
	private readonly _statusCode: number;
	private readonly _message: string;

	constructor(generatedClaimId: string) {
		this._statusCode = HttpStatusCodes.CREATED;
		this._message = `Claim generated successfully. Your claim Id is '${generatedClaimId}'.`;
	}
}
