import { HttpStatusCodes } from '../enums';

export class LoginUserResponseDto {
	private readonly _statusCode: number;
	public readonly accessToken: string;
	public readonly refreshToken: string;

	constructor(accessToken: string, refreshToken: string) {
		this._statusCode = HttpStatusCodes.OK;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}
