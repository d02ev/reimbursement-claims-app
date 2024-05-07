import { HttpStatusCodes } from '../enums';

export class NotFoundError extends Error {
	public message: string;
	public statusCode: number;

	constructor(message: string, statusCode = HttpStatusCodes.NOT_FOUND) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
	}
}
