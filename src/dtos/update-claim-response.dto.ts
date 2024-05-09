import { HttpStatusCodes } from '../enums';

export class UpdateClaimResponseDto {
	private readonly _statusCode: number;
	private readonly _message: string;

	constructor(updatedClaimId: string) {
		this._statusCode = HttpStatusCodes.OK;
		this._message = `Claim Id '${updatedClaimId}' updated successfully.`;
	}
}
