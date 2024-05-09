import { HttpStatusCodes } from '../enums';

export class ApproveClaimResponseDto {
	private readonly _statusCode: number;
	private readonly _message: string;

	constructor(approvedClaimId: string) {
		this._statusCode = HttpStatusCodes.OK;
		this._message = `Claim Id '${approvedClaimId}' approved successfully.`;
	}
}
