import {
	AccessTokenPayloadDto,
	LoginUserRequestDto,
	LoginUserResponseDto,
	RefreshAccessTokenResponseDto,
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

	refreshAccessToken(
		refreshToken: string,
	): Promise<RefreshAccessTokenResponseDto | undefined | null>;

	validateUserLocal(
		email: string,
		password: string,
	): Promise<ValidatedUserResultDto | undefined | null>;

	validateUserJwt(
		accessTokenPayloadDto: AccessTokenPayloadDto,
	): Promise<ValidatedUserResultDto | undefined | null>;
}
