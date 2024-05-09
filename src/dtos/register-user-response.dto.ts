import { HttpStatusCodes } from '../enums';

export class RegisterUserResponseDto {
	private readonly _statusCode: number;
	private readonly _message: string;

	constructor() {
		this._statusCode = HttpStatusCodes.CREATED;
		this._message = 'User registered successfully.';
	}
}
