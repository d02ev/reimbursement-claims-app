import { HttpStatusCodes } from '../enums';

export class AppError extends Error {
	public message: string;
	public statusCode: number;
	public errorCode: string;
	public stack: string | undefined;

	constructor(message: string, errorCode: string, stack?: string | undefined) {
		super(message);
		this.message = message;
		this.errorCode = errorCode;
		this.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
		this.stack = stack || Error.captureStackTrace(this, this.constructor)!;
	}
}
