import { PasswordDetail } from '@prisma/client';

export interface IPasswordDetailRepository {
	createRefreshToken(
		userId: string,
		refreshToken: string,
	): Promise<PasswordDetail | undefined | null>;

	fetchByUserId(userId: string): Promise<PasswordDetail | undefined | null>;
}
