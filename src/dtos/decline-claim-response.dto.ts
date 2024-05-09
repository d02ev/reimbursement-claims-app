import { HttpStatusCodes } from '../enums';

export class DeclineClaimResponseDto {
	private readonly _statusCode: number;
	private readonly _message: string;

	constructor(declinedClaimId: string) {
		this._statusCode = HttpStatusCodes.OK;
		this._message = `Claim Id '${declinedClaimId}' declined successfully.`;
	}
}
