import { CookieOptions, Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { IAuthService } from '../contracts';
import { AuthService } from '../services';
import { BadRequestError } from '../errors';
import { RegisterUserRequestDto } from '../dtos';

export class AuthController {
	private readonly _authService: IAuthService;
	private readonly _cookieOptions: CookieOptions;

	constructor() {
		this._authService = new AuthService();
		this._cookieOptions = {
			httpOnly: true,
			secure: true,
		};
	}

	register = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const registerUserRequestDto: RegisterUserRequestDto = { ...req.body };

			// check validations
			const validationErrors = await validate(registerUserRequestDto);

			if (validationErrors && validationErrors.length > 0) {
				return next(new BadRequestError(validationErrors.toString()));
			}

			const createUserResponseDto = await this._authService.registerUser(
				registerUserRequestDto,
			);
			return res.status(201).json(createUserResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};
}
