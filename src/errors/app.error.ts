import { HttpStatusCodes } from '../enums';
import { logger } from '../utils';

export class AppError extends Error {
	public message: string;
	public statusCode: number;
	public errorCode: string;
	public logging: boolean;
	public stack?: any;

	constructor(
		message: string,
		errorCode: string,
		statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR,
		logging = true,
		stack = null,
	) {
		super(message);
		this.message = message;
		this.errorCode = errorCode;
		this.statusCode = statusCode;
		this.logging = logging;
		this.stack = stack || Error.captureStackTrace(this, this.constructor);

		logger.error(this.message, { errorMetadata: { errorCode, stack: this.stack } });
	}
}
