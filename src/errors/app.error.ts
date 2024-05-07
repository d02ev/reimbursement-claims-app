import { HttpStatusCodes } from '../enums';
import { logger } from '../utils';

export class AppError extends Error {
	public message: string;
	public statusCode: number;
	public errorCode: string;
	public logging: boolean;
	public stack: string | undefined;

	constructor(
		message: string,
		errorCode: string,
		statusCode?: number,
		logging?: boolean,
		stack?: string | undefined,
	) {
		super(message);
		this.message = message;
		this.errorCode = errorCode;
		this.statusCode = statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
		this.logging = logging || true;
		this.stack = stack || Error.captureStackTrace(this, this.constructor)!;

		logger.error(this.message, {
			errorMetadata: { errorCode, stack: this.stack },
		});
	}
}
