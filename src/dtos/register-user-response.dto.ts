import { HttpStatusCodes } from '../enums';

export class RegisterUserResponseDto {
	private readonly statusCode: number;
	private readonly message: string;

	constructor() {
		this.statusCode = HttpStatusCodes.CREATED;
		this.message = 'User registered successfully.';
	}
}
