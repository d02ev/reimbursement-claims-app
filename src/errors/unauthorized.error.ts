import { HttpStatusCodes } from '../enums';

export class UnauthorizedError extends Error {
	public message: string;
	public statusCode: number;

	constructor(message: string, statusCode = HttpStatusCodes.UNAUTHORIZED) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
	}
}
