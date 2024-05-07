import { Request, Response, NextFunction } from 'express';
import {
	BadRequestError,
	ForbiddenError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError,
} from '../errors';

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_: NextFunction,
) => {
	if (
		err instanceof BadRequestError ||
		err instanceof ForbiddenError ||
		err instanceof NotFoundError ||
		err instanceof UnauthorizedError ||
		err instanceof InternalServerError
	) {
		return res.status(err.statusCode).json({
			statusCode: err.statusCode,
			message: err.message,
		});
	}

	return res.status(err.statusCode || 500).json({
		statusCode: err.statusCode || 500,
		message: 'Something went wrong.',
	});
};
