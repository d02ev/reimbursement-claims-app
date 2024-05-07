import { HttpStatusCodes } from '../enums';

export class ForbiddenError extends Error {
	public message: string;
	public statusCode: number;

	constructor(message: string, statusCode = HttpStatusCodes.FORBIDDEN) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
	}
}
