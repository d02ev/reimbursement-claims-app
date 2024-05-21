import { HttpStatusCodes } from '../enums';

export class RefreshAccessTokenResponseDto {
	statusCode: number;
	accessToken: string;

	constructor(accessToken: string) {
		this.statusCode = HttpStatusCodes.OK;
		this.accessToken = accessToken;
	}
}
