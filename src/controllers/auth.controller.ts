import { CookieOptions, Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { IAuthService } from '../contracts';
import { AuthService } from '../services';
import { RequestValidationError } from '../errors';
import {
	LoginUserRequestDto,
	LogoutUserResponseDto,
	RegisterUserRequestDto,
} from '../dtos';
import { HttpStatusCodes } from '../enums';

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
			const registerUserRequestDto = new RegisterUserRequestDto();
			registerUserRequestDto.fullName = req.body?.fullName;
			registerUserRequestDto.email = req.body?.email;
			registerUserRequestDto.bankName = req.body?.bankName;
			registerUserRequestDto.ifsc = req.body?.ifsc;
			registerUserRequestDto.bankAccNum = req.body?.bankAccNum;
			registerUserRequestDto.pan = req.body?.pan;
			registerUserRequestDto.password = req.body?.password;
			registerUserRequestDto.confirmPassword = req.body?.confirmPassword;

			// check validations
			const validationErrors = await validate(registerUserRequestDto);

			if (validationErrors && validationErrors.length > 0) {
				return next(new RequestValidationError(validationErrors));
			}

			const registerUserResponseDto = await this._authService.registerUser(
				registerUserRequestDto,
			);
			return res.status(HttpStatusCodes.CREATED).json(registerUserResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};

	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const loginUserRequestDto = new LoginUserRequestDto();
			loginUserRequestDto.email = req.body?.email;
			loginUserRequestDto.password = req.body?.password;

			// check validation
			const validationErrors = await validate(loginUserRequestDto);

			if (validationErrors && validationErrors.length > 0) {
				return next(new RequestValidationError(validationErrors));
			}

			const loginUserResponseDto =
				await this._authService.loginUser(loginUserRequestDto);
			return res
				.status(HttpStatusCodes.OK)
				.cookie(
					'accessToken',
					loginUserResponseDto.accessToken,
					this._cookieOptions,
				)
				.cookie(
					'refreshToken',
					loginUserResponseDto.refreshToken,
					this._cookieOptions,
				)
				.json(loginUserResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	logout = (_: Request, res: Response, next: NextFunction) => {
		try {
			return res
				.status(HttpStatusCodes.OK)
				.clearCookie('accessToken', this._cookieOptions)
				.clearCookie('refreshToken', this._cookieOptions)
				.json(new LogoutUserResponseDto());
		} catch (err: any) {
			return next(err);
		}
	};
}
