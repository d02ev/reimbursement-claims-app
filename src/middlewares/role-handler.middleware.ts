import { Request, Response, NextFunction } from 'express';
import { HttpStatusCodes, UserRoles } from '../enums';
import { ValidatedUserResultDto } from '../dtos';

export const roleHandler = (allowedRole: UserRoles) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as ValidatedUserResultDto;
		const userRole = user.role;

		if (!userRole) {
			return res.status(HttpStatusCodes.UNAUTHORIZED).json({
				statusCode: HttpStatusCodes.UNAUTHORIZED,
				message: 'Unauthorized access.',
			});
		}

		if (allowedRole !== userRole) {
			return res.status(HttpStatusCodes.FORBIDDEN).json({
				statusCode: HttpStatusCodes.FORBIDDEN,
				message: 'Restricted access.',
			});
		}

		return next();
	};
};
