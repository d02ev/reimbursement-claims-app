import { HttpStatusCodes } from '../enums';

export class BadRequestError extends Error {
	public message: string;
	public statusCode: number;

	constructor(message: string, statusCode = HttpStatusCodes.BAD_REQUEST) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
	}
}
