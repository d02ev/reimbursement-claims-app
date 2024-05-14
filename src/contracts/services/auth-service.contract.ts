import {
	AccessTokenPayloadDto,
	LoginUserRequestDto,
	LoginUserResponseDto,
	RegisterUserRequestDto,
	RegisterUserResponseDto,
	UserDetailsDto,
	ValidatedUserResultDto,
} from '../../dtos';

export interface IAuthService {
	registerUser(
		registerUserRequestDto: RegisterUserRequestDto,
	): Promise<RegisterUserResponseDto>;

	loginUser(
		loginUserRequestDto: LoginUserRequestDto,
	): Promise<LoginUserResponseDto>;

	getUserDetails(userId: string): Promise<UserDetailsDto | undefined | null>;

	validateUserLocal(
		email: string,
		password: string,
	): Promise<ValidatedUserResultDto | undefined | null>;

	validateUserJwt(
		accessTokenPayloadDto: AccessTokenPayloadDto,
	): Promise<ValidatedUserResultDto | undefined | null>;
}
