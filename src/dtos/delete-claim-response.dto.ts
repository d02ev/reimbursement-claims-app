import { HttpStatusCodes } from '../enums';

export class DeleteClaimResponseDto {
	private readonly _statusCode: number;
	private readonly _message: string;

	constructor(deletedClaimId: string) {
		this._statusCode = HttpStatusCodes.OK;
		this._message = `Claim Id '${deletedClaimId}' deleted successfully.`;
	}
}
