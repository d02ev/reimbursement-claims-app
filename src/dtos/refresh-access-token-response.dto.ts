import { HttpStatusCodes } from '../enums';

export class RefreshAccessTokenResponseDto {
	statusCode: number;
	accessToken: string;
	refreshToken: string;

	constructor(accessToken: string, refreshToken: string) {
		this.statusCode = HttpStatusCodes.OK;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}
