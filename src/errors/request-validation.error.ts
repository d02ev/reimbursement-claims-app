import { HttpStatusCodes } from '../enums';

export class RequestValidationError extends Error {
	public message: string;
	public statusCode: number;
	public errors: any[];

	constructor(errors: any[], statusCode?: number, message?: string) {
		super(message);
		this.message = message || 'Request validation failed.';
		this.statusCode = statusCode || HttpStatusCodes.BAD_REQUEST;
		this.errors = errors;
	}
}
