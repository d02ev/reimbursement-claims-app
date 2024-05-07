import { Request, Response, NextFunction } from 'express';
import {
	BadRequestError,
	ForbiddenError,
	InternalServerError,
	NotFoundError,
	RequestValidationError,
	UnauthorizedError,
} from '../errors';
import { logger } from '../utils';

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
		err instanceof InternalServerError ||
		err instanceof RequestValidationError
	) {
		return res.status(err.statusCode).json(err);
	}

	logger.error(err.message, { errorMetadata: { err, stack: err.stack } });
	return res.status(err.statusCode || 500).json({
		statusCode: err.statusCode || 500,
		message: 'Something went wrong.',
	});
};
