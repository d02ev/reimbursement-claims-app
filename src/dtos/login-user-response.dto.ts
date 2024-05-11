import { HttpStatusCodes } from '../enums';

export class LoginUserResponseDto {
	private readonly statusCode: number;
	public readonly accessToken: string;
	public readonly refreshToken: string;

	constructor(accessToken: string, refreshToken: string) {
		this.statusCode = HttpStatusCodes.OK;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}
