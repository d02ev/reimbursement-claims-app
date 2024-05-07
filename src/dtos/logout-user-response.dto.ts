import { HttpStatusCodes } from '../enums';

export class LogoutUserResponseDto {
	private readonly _statusCode: number;
	private readonly _message: string;

	constructor() {
		this._statusCode = HttpStatusCodes.OK;
		this._message = 'User logged out successfully.';
	}
}
