import { AppErrorCodes } from '../enums';
import { AppError } from './app.error';

export class ForbiddenError extends AppError {
	constructor(message: string) {
		super(message, AppErrorCodes.NO_APP_ERROR);
	}
}
