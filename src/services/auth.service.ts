import {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { IPasswordDetailRepository, IUserRepository } from '../contracts';
import { IAuthService } from '../contracts';
import {
	RegisterUserRequestDto,
	RegisterUserResponseDto,
	LoginUserRequestDto,
	LoginUserResponseDto,
	ValidatedUserResultDto,
	AccessTokenPayloadDto,
} from '../dtos';
import { AppErrorCodes, HttpStatusCodes, UserRoles } from '../enums';
import { PasswordDetailRepository, UserRepository } from '../repository';
import { AuthUtil } from '../utils';
import { AppError, BadRequestError, NotFoundError } from '../errors';
import { JwtPayload } from 'jsonwebtoken';

export class AuthService implements IAuthService {
	private readonly _userRepository: IUserRepository;
	private readonly _passwordDetailRepository: IPasswordDetailRepository;
	private readonly _authUtil: AuthUtil;

	constructor() {
		this._userRepository = new UserRepository();
		this._passwordDetailRepository = new PasswordDetailRepository();
		this._authUtil = new AuthUtil();
	}

	async registerUser(
		registerUserRequestDto: RegisterUserRequestDto,
	): Promise<RegisterUserResponseDto> {
		try {
			const { fullName, email, bankName, ifsc, bankAccNum, pan, password } =
				registerUserRequestDto;
			const role =
				email === 'app.admin@example.com' ? UserRoles.ADMIN : UserRoles.USER;
			const passwordHash = await this._authUtil.createPasswordHash(password);

			await this._userRepository.create(
				fullName,
				email,
				role,
				passwordHash,
				ifsc,
				bankName,
				bankAccNum,
				pan,
			);

			const registerUserResponseDto: RegisterUserResponseDto = {
				statusCode: HttpStatusCodes.CREATED,
				message: 'User registered successfully',
			};
			return registerUserResponseDto;
		} catch (err: any) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === 'P2002') {
					throw new BadRequestError(err.message);
				}

				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
					true,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
					true,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
				true,
				err.stack,
			);
		}
	}

	async loginUser(
		loginUserRequestDto: LoginUserRequestDto,
	): Promise<LoginUserResponseDto> {
		try {
			const { email } = loginUserRequestDto;
			const user = await this._userRepository.fetchByEmail(email);

			if (!user) {
				throw new NotFoundError('');
			}

			const accessTokenPayload: AccessTokenPayloadDto = {
				sub: user.id,
				role: user.roleId,
			};
			const refreshTokenPayload: JwtPayload = {
				sub: user.id,
			};
			const accessToken =
				this._authUtil.generateAccessToken(accessTokenPayload);
			const refreshToken =
				this._authUtil.generateRefreshToken(refreshTokenPayload);

			await this._passwordDetailRepository.createRefreshToken(
				user.id,
				refreshToken,
			);

			const loginUserResponseDto: LoginUserResponseDto = {
				statusCode: HttpStatusCodes.CREATED,
				accessToken,
				refreshToken,
			};

			return loginUserResponseDto;
		} catch (err: any) {
			if (err instanceof NotFoundError) {
				throw new NotFoundError('User does not exist.');
			}
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === 'P2025') {
					throw new BadRequestError(err.message);
				}

				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
					true,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
					true,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
				true,
				err.stack,
			);
		}
	}

	async validateUserLocal(
		email: string,
		password: string,
	): Promise<ValidatedUserResultDto | undefined | null> {
		try {
			const user = await this._userRepository.fetchByEmail(email);

			if (!user) {
				return null;
			}

			const passwordMatch = await this._authUtil.comparePasswordHash(
				password,
				user.passowordDetail?.passwordHash!,
			);

			if (passwordMatch) {
				return null;
			}

			const validateUserResultDto: ValidatedUserResultDto = {
				id: user.id,
				email: user.email,
				role: user.role.role,
			};
			return validateUserResultDto;
		} catch (err: any) {
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
					true,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
					true,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
				true,
				err.stack,
			);
		}
	}

	async validateUserJwt(
		accessTokenPayloadDto: AccessTokenPayloadDto,
	): Promise<ValidatedUserResultDto | undefined | null> {
		try {
			const user = await this._userRepository.fetchById(
				accessTokenPayloadDto.sub!,
			);

			if (!user) {
				return null;
			}

			const validateUserResultDto: ValidatedUserResultDto = {
				id: user.id,
				email: user.email,
				role: user.role.role,
			};

			return validateUserResultDto;
		} catch (err: any) {
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
					true,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
					true,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
				true,
				err.stack,
			);
		}
	}
}
