import { HttpStatusCodes } from '../enums';
import { ValidationError } from 'class-validator';

export class RequestValidationError extends Error {
	public message: string;
	public statusCode: number;
	public errors: ValidationError[];

	constructor(
		errors: ValidationError[],
		statusCode?: number,
		message?: string,
	) {
		super(message);
		this.message = message || 'Request validation failed.';
		this.statusCode = statusCode || HttpStatusCodes.BAD_REQUEST;
		this.errors = errors;
	}
}
