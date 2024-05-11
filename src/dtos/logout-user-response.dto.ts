import { HttpStatusCodes } from '../enums';

export class LogoutUserResponseDto {
	private readonly statusCode: number;
	private readonly message: string;

	constructor() {
		this.statusCode = HttpStatusCodes.OK;
		this.message = 'User logged out successfully.';
	}
}
